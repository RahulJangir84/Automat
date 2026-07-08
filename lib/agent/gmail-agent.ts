// lib/agent/gmail-agent.ts
import { auth, clerkClient, Client } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function runGmailAgent(userClerkId: string) {
    const { userId } = await auth();
    if (!userId) {
        console.error("Unauthorized access attempt");
        redirect("/sign-in");
    }
    try {
        const client = await clerkClient();
        // Retrieve the OAuth access token from Clerk
        const response = await client.users.getUserOauthAccessToken(
            userClerkId,
            "google"
        );

        const tokenData = response.data[0];
        if (!tokenData) {
            throw new Error('Google OAuth token not found. Please connect your Google account.');
        }

        const accessToken = tokenData.token;
        // Now you can make authorized API calls to Google APIs on behalf of the user
        const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const profile = await res.json();
        console.log('Gmail Profile:', profile);

    } catch (error) {
        console.error('Agent failed to get OAuth access token:', error);
    }
}
