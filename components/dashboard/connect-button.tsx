'use client';

import { useUser, useReverification } from '@clerk/nextjs';
import { useMemo, useState } from 'react';

export default function ConnectGoogleButton() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);

  const createExternalAccountWithReverification = useReverification(
    async (args) => {
      if (!user) {
        throw new Error("User not loaded");
      }
      return user.createExternalAccount(args);
    }
  );

  const notionAccount = user?.externalAccounts.find(
      (account) => account.provider === "notion"
    );

  async function handleConnectNotion() {
    try{
      setLoading(true);
      const response = await createExternalAccountWithReverification({
        strategy: "oauth_notion",
        redirectUrl: window.location.href,
      });
      const redirectUrl = response?.verification?.externalVerificationRedirectURL;
      if (redirectUrl) {
        window.location.href = redirectUrl.toString();
      } else {
                throw new Error("No redirect URL returned from Clerk Notion flow");
      }
    } catch (error) {
      console.error("Error connecting notion account:", error);
      if (error instanceof Error) {
        console.error("Error connecting to notion", {
          description: error.message || "Failed to initiate notion connection",
        });
      } else {
        console.error("Error connecting to notion", {
          description: "Failed to initiate notion connection",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  if (!isLoaded) {
    return (
      <button
        disabled
        className="px-4 py-2 rounded-md bg-gray-300 text-gray-600 cursor-not-allowed"
      >
        Loading...
      </button>
    );
  }

  return (
    <button
      onClick={handleConnectNotion}
      disabled={loading}
      className={`px-4 py-2 rounded-md text-white transition
          ? 'bg-green-600 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700'
      } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {loading
        ? 'Connecting...' : loading
        ? 'Google Connected' : 'Connect Google'}
    </button>
  );
}