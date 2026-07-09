import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export async function runCommandTool(projectRoot: string, command: string) {
  try {
    const { stdout, stderr } = await execAsync(command, {
      cwd: projectRoot,
    });
    return {
      command,
      exitCode: 0,
      stdout,
      stderr,
    };
  } catch (error: any) {
    return {
      command,
      exitCode: error.code || 1,
      stdout: error.stdout || "",
      stderr: error.stderr || error.message,
    };
  }
}