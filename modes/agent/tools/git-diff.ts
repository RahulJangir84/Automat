import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export async function gitDiffTool(projectRoot: string) {
  try {
    const { stdout, stderr } = await execAsync("git diff -- .", {
      cwd: projectRoot,
    });
    return {
      exitCode: 0,
      diff: stdout || stderr,
    };
  } catch (error: any) {
    return {
      exitCode: error.code || 1,
      diff: error.stdout || error.stderr || error.message,
    };
  }
}