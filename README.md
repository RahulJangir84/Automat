This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


automat/
├─ src/
│  ├─ cli/
│  │  └─ index.ts            # commander / terminal entry
│  ├─ agent/
│  │  ├─ run-agent.ts        # main orchestration loop
│  │  ├─ planner.ts          # planning prompt / task decomposition
│  │  ├─ executor.ts         # executes tool calls
│  │  ├─ memory.ts           # stores conversation/task state
│  │  ├─ types.ts           # shared agent types
│  │  └─ prompts.ts         # system prompts / templates
│  ├─ tools/
│  │  ├─ read-file.ts
│  │  ├─ write-file.ts
│  │  ├─ list-files.ts
│  │  ├─ search-code.ts
│  │  ├─ run-command.ts
│  │  ├─ apply-patch.ts
│  │  └─ git-diff.ts
│  ├─ llm/
│  │  ├─ provider.ts         # OpenAI/Anthropic/Gemini wrapper
│  │  └─ schemas.ts          # zod schemas for tool calls / plans
│  ├─ skills/
│  │  ├─ clerk-setup.md
│  │  ├─ nextjs-patterns.md
│  │  └─ prisma-fixes.md
│  ├─ project/
│  │  ├─ detect-project.ts   # Next / Vite / Node / monorepo detection
│  │  └─ analyze-project.ts
│  └─ utils/
│     ├─ logger.ts
│     ├─ paths.ts
│     └─ fs.ts
├─ package.json
├─ tsconfig.json
└─ .env

agent/
├─ tools/
│  ├─ git-diff.ts       -> get git diff / changed files
│  ├─ list-files.ts     -> recursively list files/folders
│  ├─ read-file.ts      -> read a file
│  ├─ run-command.ts    -> run shell command safely
│  └─ write-file.ts     -> write / overwrite a file
│
├─ action-tracker.ts    -> keep staged actions / logs / approvals
├─ executor.ts          -> map Gemini tool calls to actual TS functions
├─ orchestrator.ts      -> main agent loop with Gemini
├─ types.ts             -> shared types/interfaces
└─ cliMode.ts           -> CLI mode menu (you already have this)