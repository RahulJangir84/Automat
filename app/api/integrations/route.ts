// app/api/integrations/sync/route.ts
import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { db } from '@/database';
import { integrations, users } from '@/database/schema';
import { eq, and } from 'drizzle-orm';

export async function POST() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return new NextResponse('Unauthorized', { status: 401 });

  const client = await clerkClient();
  const clerkUser = await client.users.getUser(clerkId);

  // Check if Google is in connected external accounts
  const googleAccount = clerkUser.externalAccounts.find(
    (acc) => acc.provider === 'google'
  );

  if (googleAccount) {
    // 1. Get local user ID
    const [localUser] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId));

    if (localUser) {
      // 2. Insert or update the integration status in DB (without storing the raw token)
      await db
        .insert(integrations)
        .values({
          userId: localUser.id,
          provider: 'gmail', // or google_calendar
          accessToken: 'STORED_IN_CLERK', // Placeholder
          refreshToken: 'STORED_IN_CLERK', // Placeholder
          expiresAt: new Date(Date.now() + 3600 * 1000), // Placeholder
          scope: googleAccount.approvedScopes.split(' '),
        })
        .onConflictDoNothing();
    }
  }

  return NextResponse.json({ success: true });
}
