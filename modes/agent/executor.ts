import { readFileTool } from "./tools/read-file.js";
import { writeFileTool } from "./tools/write-file.js";
import { listFilesTool } from "./tools/list-files.js";
import { runCommandTool } from "./tools/run-command.js";
import { gitDiffTool } from "./tools/git-diff.js";
import type { ToolCall, ToolResult } from "./types.js";

export class ToolExecutor {
    constructor(private projectRoot: string) { }

    async execute(call: ToolCall): Promise<ToolResult> {
        try {
            switch (call.name) {
                case "readFile": {
                    const path = String(call.args.path);
                    const result = await readFileTool(this.projectRoot, path);
                    return { ok: true, output: result };
                }

                case "writeFile": {
                    const path = String(call.args.path);
                    const content = String(call.args.content);
                    const result = await writeFileTool(this.projectRoot, path, content);
                    return { ok: true, output: result };
                }

                case "listFiles": {
                    const path = String(call.args.path ?? ".");
                    const recursive = Boolean(call.args.recursive ?? false);
                    const result = await listFilesTool(this.projectRoot, path, recursive);
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
                        output: `Unknown tool: ${call.name}`,
                    };
            }
        } catch (error) {
            return {
                ok: false,
                output:
                    error instanceof Error ? error.message : "Unknown tool execution error",
            };
        }
    }
}