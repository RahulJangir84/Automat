import { NextResponse } from 'next/server';
import { db } from '@/database';
import { users } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { runGmailAgent } from '@/lib/agent/gmail-agent';

export async function GET(request: Request) {
  // 1. Secure the endpoint using Vercel's standard CRON_SECRET authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // 2. Fetch all users who have the automation agent enabled
    const activeUsers = await db
      .select()
      .from(users)
      .where(eq(users.agentEnabled, true));

    console.log(`Starting Gmail agent run for ${activeUsers.length} users...`);

    // 3. Run the agent for each active user in parallel (handling failures gracefully per-user)
    const results = await Promise.allSettled(
      activeUsers.map(async (user) => {
        console.log(`Running Gmail agent for user ${user.id} (${user.email})...`);
        await runGmailAgent(user.clerkId);
      })
    );

    // Log the summary of results
    results.forEach((res, index) => {
      const user = activeUsers[index];
      if (res.status === 'fulfilled') {
        console.log(`Successfully completed agent run for user ${user.id}`);
      } else {
        console.error(`Failed agent run for user ${user.id}:`, res.reason);
      }
    });

    return NextResponse.json({
      success: true,
      processedCount: activeUsers.length,
    });
  } catch (error) {
    console.error('Failed to execute agent cron job:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
