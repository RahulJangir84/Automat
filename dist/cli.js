#!/usr/bin/env node

// scripts/cli.ts
import "dotenv/config";
import { Command } from "commander";

// terminalui/greet.ts
import { select as select2, isCancel as isCancel2 } from "@clack/prompts";
import chalk3 from "chalk";
import figlet from "figlet";

// modes/cliMode.ts
import { select, isCancel } from "@clack/prompts";
import chalk2 from "chalk";

// modes/agent/orchestrator.ts
import "dotenv/config";
import { GoogleGenAI, Type } from "@google/genai";
import chalk from "chalk";

// modes/agent/tools/read-file.ts
import fs from "fs/promises";
import path from "path";
async function readFileTool(projectRoot, relPath) {
  const fullPath = path.join(projectRoot, relPath);
  const content = await fs.readFile(fullPath, "utf8");
  return {
    path: relPath,
    content
  };
}

// modes/agent/tools/write-file.ts
import fs2 from "fs/promises";
import path2 from "path";
async function writeFileTool(projectRoot, relPath, content) {
  const fullPath = path2.join(projectRoot, relPath);
  await fs2.mkdir(path2.dirname(fullPath), { recursive: true });
  await fs2.writeFile(fullPath, content, "utf8");
  return {
    success: true,
    path: relPath
  };
}

// modes/agent/tools/list-files.ts
import fs3 from "fs/promises";
import path3 from "path";
async function listFilesTool(projectRoot, relDir = ".", recursive = false) {
  const root = path3.join(projectRoot, relDir);
  async function walk(dir, base) {
    const entries = await fs3.readdir(dir, { withFileTypes: true });
    const result = [];
    for (const entry of entries) {
      const abs = path3.join(dir, entry.name);
      const rel = path3.join(base, entry.name).replace(/\\/g, "/");
      if (entry.isDirectory()) {
        result.push({
          name: entry.name,
          path: rel,
          type: "directory"
        });
        if (recursive) {
          result.push(...await walk(abs, rel));
        }
      } else {
        result.push({
          name: entry.name,
          path: rel,
          type: "file"
        });
      }
    }
    return result;
  }
  return walk(root, relDir === "." ? "" : relDir);
}

// modes/agent/tools/run-command.ts
import { exec } from "child_process";
import { promisify } from "util";
var execAsync = promisify(exec);
async function runCommandTool(projectRoot, command) {
  try {
    const { stdout, stderr } = await execAsync(command, {
      cwd: projectRoot
    });
    return {
      command,
      exitCode: 0,
      stdout,
      stderr
    };
  } catch (error) {
    return {
      command,
      exitCode: error.code || 1,
      stdout: error.stdout || "",
      stderr: error.stderr || error.message
    };
  }
}

// modes/agent/tools/git-diff.ts
import { exec as exec2 } from "child_process";
import { promisify as promisify2 } from "util";
var execAsync2 = promisify2(exec2);
async function gitDiffTool(projectRoot) {
  try {
    const { stdout, stderr } = await execAsync2("git diff -- .", {
      cwd: projectRoot
    });
    return {
      exitCode: 0,
      diff: stdout || stderr
    };
  } catch (error) {
    return {
      exitCode: error.code || 1,
      diff: error.stdout || error.stderr || error.message
    };
  }
}

// modes/agent/executor.ts
var ToolExecutor = class {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
  }
  async execute(call) {
    try {
      switch (call.name) {
        case "readFile": {
          const path4 = String(call.args.path);
          const result = await readFileTool(this.projectRoot, path4);
          return { ok: true, output: result };
        }
        case "writeFile": {
          const path4 = String(call.args.path);
          const content = String(call.args.content);
          const result = await writeFileTool(this.projectRoot, path4, content);
          return { ok: true, output: result };
        }
        case "listFiles": {
          const path4 = String(call.args.path ?? ".");
          const recursive = Boolean(call.args.recursive ?? false);
          const result = await listFilesTool(this.projectRoot, path4, recursive);
          return { ok: true, output: result };
        }
        case "runCommand": {
          const command = String(call.args.command);
          const result = await runCommandTool(this.projectRoot, command);
          return { ok: true, output: result };
        }
        case "gitDiff": {
          const result = await gitDiffTool(this.projectRoot);
          return { ok: true, output: result };
        }
        default:
          return {
            ok: false,
            output: `Unknown tool: ${call.name}`
          };
      }
    } catch (error) {
      return {
        ok: false,
        output: error instanceof Error ? error.message : "Unknown tool execution error"
      };
    }
  }
};

// modes/agent/orchestrator.ts
var ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});
var toolDeclarations = [
  {
    name: "listFiles",
    description: "List files and directories under a path in the project.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        path: {
          type: Type.STRING,
          description: "Relative path from project root, e.g. '.' or 'src'"
        },
        recursive: {
          type: Type.BOOLEAN,
          description: "Whether to recurse into subdirectories"
        }
      },
      required: ["path"]
    }
  },
  {
    name: "readFile",
    description: "Read a UTF-8 text file from the project.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        path: {
          type: Type.STRING,
          description: "Relative path of the file"
        }
      },
      required: ["path"]
    }
  },
  {
    name: "writeFile",
    description: "Create a new file or completely overwrite an existing file with content.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        path: { type: Type.STRING, description: "Relative file path" },
        content: {
          type: Type.STRING,
          description: "Full file contents"
        }
      },
      required: ["path", "content"]
    }
  },
  {
    name: "runCommand",
    description: "Run a shell command in the project root, e.g. npm run build or npm install.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        command: {
          type: Type.STRING,
          description: "Shell command to run"
        }
      },
      required: ["command"]
    }
  },
  {
    name: "gitDiff",
    description: "Get the current git diff for the project.",
    parameters: {
      type: Type.OBJECT,
      properties: {}
    }
  }
];
function extractText(response) {
  return response?.text ?? "";
}
function extractFunctionCalls(response) {
  const candidates = response?.functionCalls ?? [];
  return Array.isArray(candidates) ? candidates : [];
}
async function runAgentMode() {
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
  let conversation = [
    {
      role: "user",
      parts: [{ text: `${systemPrompt}

Task: ${userTask}` }]
    }
  ];
  for (let step = 1; step <= 15; step++) {
    console.log(chalk.dim(`Step ${step}...`));
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: conversation,
      config: {
        tools: [{ functionDeclarations: toolDeclarations }]
      }
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
        name: call.name,
        args: call.args ?? {}
      });
      conversation.push({
        role: "model",
        parts: [
          {
            functionCall: {
              name: call.name,
              args: call.args ?? {}
            }
          }
        ]
      });
      conversation.push({
        role: "user",
        parts: [
          {
            functionResponse: {
              name: call.name,
              response: result
            }
          }
        ]
      });
    }
  }
  console.log(chalk.red("Stopped after max steps.\n"));
}
async function promptUserForTask() {
  const readline = await import("readline/promises");
  const { stdin, stdout } = await import("process");
  const rl = readline.createInterface({ input: stdin, output: stdout });
  const answer = await rl.question("What should the agent do? ");
  rl.close();
  const task = answer.trim();
  return task.length ? task : null;
}

// modes/cliMode.ts
async function runCliMode() {
  while (true) {
    const mode = await select({
      message: "Choose CLI sub-mode",
      options: [
        { value: "agent", label: "Agent based mode" },
        { value: "plan", label: "Plan based mode" },
        { value: "ask", label: "Ask a question" },
        { value: "back", label: "Go Back" }
      ]
    });
    if (isCancel(mode) || mode === "back") {
      return;
    }
    if (mode === "agent") {
      await runAgentMode();
    } else if (mode === "plan") {
      console.log(chalk2.blue("\nPlan based mode"));
    } else if (mode === "ask") {
      console.log(chalk2.blue("\nAsk mode"));
    } else {
      console.log(chalk2.yellow("\n choose a valid mode"));
    }
  }
}

// terminalui/greet.ts
var BANNER_FONT = "ANSI Shadow";
var SHADOW = chalk3.hex("#5b4d9e");
var FACE = chalk3.hex("#e8dcf8").bold;
function printBannerWithShadow(ascii) {
  const bannerLines = ascii.replace(/\s+$/, "").split("\n");
  const maxLen = Math.max(...bannerLines.map((l) => l.length), 0);
  const rowWidth = maxLen + 2;
  for (const line of bannerLines) {
    console.log(SHADOW(("  " + line).padEnd(rowWidth)));
  }
  process.stdout.write(`\x1B[${bannerLines.length}A`);
  for (const line of bannerLines) {
    console.log(FACE(line.padEnd(rowWidth)));
  }
  console.log();
}
async function runGreet() {
  let name;
  try {
    name = figlet.textSync("AutoMat", { font: BANNER_FONT });
  } catch {
    name = figlet.textSync("AutoMat", { font: "Standard" });
  }
  printBannerWithShadow(name);
  const mode = await select2({
    message: "Select a mode",
    options: [
      { label: "CLI", value: "cli" },
      { label: "Telegram", value: "telegram" },
      { label: "Exit", value: "exit" }
    ]
  });
  if (isCancel2(mode) || mode === "exit") {
    console.log(chalk3.dim("Exiting..."));
    process.exit(0);
  }
  if (mode === "cli") {
    console.log(chalk3.dim("Starting CLI mode..."));
    await runCliMode();
  } else if (mode === "telegram") {
    console.log(chalk3.dim("Starting Telegram mode..."));
  }
}

// scripts/cli.ts
var program = new Command();
program.name("AutoMat").description("Autonomous coding assistant").version("1.0.0");
program.command("run").description("Show the banner and pick cli or telegram").action(async () => {
  await runGreet();
});
await program.parseAsync(process.argv);
