import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-tr from-zinc-50 via-white to-zinc-100 p-4 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Sign up to get started with our platform
          </p>
        </div>
        <div className="flex justify-center shadow-2xl rounded-2xl overflow-hidden">
          <SignUp />
        </div>
      </div>
    </div>
  );
}
