import fs from "node:fs/promises";
import path from "node:path";

export async function writeFileTool(
  projectRoot: string,
  relPath: string,
  content: string
) {
  const fullPath = path.join(projectRoot, relPath);

  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, content, "utf8");

  return {
    success: true,
    path: relPath,
  };
}