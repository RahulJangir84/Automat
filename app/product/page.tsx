import { auth, currentUser } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default async function ProductPage() {
  const { userId } = await auth();
  const user = await currentUser();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-tr from-zinc-50 via-white to-zinc-100 p-6 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 text-zinc-900 dark:text-zinc-50">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl flex flex-col gap-6 items-center">
        <div className="flex items-center justify-between w-full border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Dashboard</span>
            <h1 className="text-xl font-bold">Workspace</h1>
          </div>
          <div className="flex items-center justify-center p-1 rounded-full border border-zinc-100 dark:border-zinc-800">
            <UserButton />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 w-full text-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center font-bold text-amber-500 text-3xl shadow-inner">
              {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
          
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">
              Hello, {user?.firstName || 'Valued User'}!
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {user?.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </div>

        <div className="w-full space-y-3 bg-zinc-50 dark:bg-zinc-900/80 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-left text-xs font-mono">
          <div className="flex justify-between">
            <span className="text-zinc-400">User ID:</span>
            <span className="text-zinc-600 dark:text-zinc-300 select-all">{userId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Created:</span>
            <span className="text-zinc-600 dark:text-zinc-300">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Last Sign In:</span>
            <span className="text-zinc-600 dark:text-zinc-300">
              {user?.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString() : 'N/A'}
            </span>
          </div>
        </div>

        <Link
          href="/"
          className="w-full py-3 px-4 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all font-medium text-center shadow-lg text-sm"
        >
          Go back Home
        </Link>
      </div>
    </div>
  );
}
