import fs from "node:fs/promises";
import path from "node:path";

export async function readFileTool(projectRoot: string, relPath: string) {
  const fullPath = path.join(projectRoot, relPath);
  const content = await fs.readFile(fullPath, "utf8");

  return {
    path: relPath,
    content,
  };
}