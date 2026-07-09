import "dotenv/config";
import path from "node:path";
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import chalk from "chalk";
import { ToolExecutor } from "./executor.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const toolDeclarations: FunctionDeclaration[] = [
  {
    name: "listFiles",
    description: "List files and directories under a path in the project.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        path: {
          type: Type.STRING,
          description: "Relative path from project root, e.g. '.' or 'src'",
        },
        recursive: {
          type: Type.BOOLEAN,
          description: "Whether to recurse into subdirectories",
        },
      },
      required: ["path"],
    },
  },
  {
    name: "readFile",
    description: "Read a UTF-8 text file from the project.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        path: {
          type: Type.STRING,
          description: "Relative path of the file",
        },
      },
      required: ["path"],
    },
  },
  {
    name: "writeFile",
    description:
      "Create a new file or completely overwrite an existing file with content.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        path: { type: Type.STRING, description: "Relative file path" },
        content: {
          type: Type.STRING,
          description: "Full file contents",
        },
      },
      required: ["path", "content"],
    },
  },
  {
    name: "runCommand",
    description:
      "Run a shell command in the project root, e.g. npm run build or npm install.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        command: {
          type: Type.STRING,
          description: "Shell command to run",
        },
      },
      required: ["command"],
    },
  },
  {
    name: "gitDiff",
    description: "Get the current git diff for the project.",
    parameters: {
      type: Type.OBJECT,
      properties: {},
    },
  },
];

function extractText(response: any): string {
  return response?.text ?? "";
}

function extractFunctionCalls(response: any): Array<{ name: string; args: any }> {
  const candidates = response?.functionCalls ?? [];
  return Array.isArray(candidates) ? candidates : [];
}

export async function runAgentMode() {
  const projectRoot = process.cwd();
  const executor = new ToolExecutor(projectRoot);

  const userTask = await promptUserForTask();
  if (!userTask) return;

  console.log(chalk.cyan("\nStarting agent...\n"));

  const systemPrompt = `
You are an autonomous coding assistant working inside a local TypeScript/Next.js codebase.

Rules:
1. Inspect the codebase before editing files.
2. Prefer reading package.json and relevant source files first.
3. Use writeFile only when you have enough context.
4. After making code changes, run verification commands if useful (e.g. npm run build).
5. Be concise and goal-oriented.
`;

  let conversation: any[] = [
    {
      role: "user",
      parts: [{ text: `${systemPrompt}\n\nTask: ${userTask}` }],
    },
  ];

  for (let step = 1; step <= 15; step++) {
    console.log(chalk.dim(`Step ${step}...`));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: conversation,
      config: {
        tools: [{ functionDeclarations: toolDeclarations }],
      },
    });

    const text = extractText(response);
    const functionCalls = extractFunctionCalls(response);

    if (text?.trim()) {
      console.log(chalk.green("\nGemini:\n"));
      console.log(text.trim(), "\n");
    }

    if (!functionCalls.length) {
      console.log(chalk.blue("Agent finished.\n"));
      return;
    }

    for (const call of functionCalls) {
      console.log(chalk.yellow(`Calling tool: ${call.name}`));

      const result = await executor.execute({
        name: call.name as any,
        args: call.args ?? {},
      });

      conversation.push({
        role: "model",
        parts: [
          {
            functionCall: {
              name: call.name,
              args: call.args ?? {},
            },
          },
        ],
      });

      conversation.push({
        role: "user",
        parts: [
          {
            functionResponse: {
              name: call.name,
              response: result,
            },
          },
        ],
      });
    }
  }

  console.log(chalk.red("Stopped after max steps.\n"));
}

async function promptUserForTask(): Promise<string | null> {
  const readline = await import("node:readline/promises");
  const { stdin, stdout } = await import("node:process");

  const rl = readline.createInterface({ input: stdin, output: stdout });
  const answer = await rl.question("What should the agent do? ");
  rl.close();

  const task = answer.trim();
  return task.length ? task : null;
}