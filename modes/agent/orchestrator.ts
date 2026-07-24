import "dotenv/config";
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import chalk from "chalk";
import { ToolExecutor } from "./executor.js";
import { ApiError } from "@google/genai";
import { renderTerminalMarkdown } from "../../terminalui/marked";

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
        name:"findFile",
        description:"Locate a file anywhere in the project by filename. Use this whenever the user provides only a filename and the path is unknown.",
        parameters:{
            type:Type.OBJECT,
            properties:{
                fileName:{
                    type:Type.STRING,
                    description:"The name of the file to find, e.g. package.json or utils.ts"
                }
            },
            required:["fileName"]
        }
    },
    {
        name: "readFile",
        description: "Read a UTF-8 text file. The path MUST be the exact relative path from the project root (for example src/utils/greet.ts). If only the filename is known, call listFiles recursively first.",
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
You are an autonomous coding assistant working inside a local TypeScript project.

Important rules:

- Never assume the location of a file.
- If the user mentions only a filename (e.g. greet.ts),
  FIRST call listFiles with recursive=true.
- Find the exact relative path.
- Only then call readFile with that exact path.
- readFile requires the complete relative path from the project root.
`;

    let conversation: any[] = [
        {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\nTask: ${userTask}` }],
        },
    ];

    for (let step = 1; step <= 15; step++) {
        console.log(chalk.dim(`Step ${step}...`));
        let response;
        try {
            response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: conversation,
                config: {
                    systemInstruction: systemPrompt,
                    tools: [{ functionDeclarations: toolDeclarations }],
                },
            });
        }
        catch (error) {
            if (error instanceof ApiError) {
                if (error.status === 503) {
                    console.warn("Primary model busy. Switching to gemini-3.1-flash-lite...");
                } else if (error.status === 429) {
                    console.error(chalk.red("API Quota exceeded. Please wait a moment or check your API key limits."));
                    process.exit(0);
                } else {
                    console.error(chalk.red(`Gemini API error (${error.status}): ${error.message}`));
                    process.exit(1);
                }
                response = await ai.models.generateContent({
                    model: 'gemini-2.5 Flash',
                    contents: conversation,
                    config: {
                        systemInstruction: systemPrompt,
                        tools: [{ functionDeclarations: toolDeclarations }],
                    }
                });
            } else {
                throw error;
            }
        }
        const text = extractText(response);
        const functionCalls = extractFunctionCalls(response);
        if (text?.trim()) {
            console.log(chalk.green("\nGemini:\n"));
            console.log(renderTerminalMarkdown(text.trim()), "\n");
        }
        // 1. Push the model's exact response content to keep thoughts/metadata intact
        if (response?.candidates?.[0]?.content) {
            conversation.push(response.candidates[0].content);
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
            // 2. Push the tool outcome response to the history under user role
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