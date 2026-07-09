import fs from "node:fs/promises";
import path from "node:path";

type FileEntry = {
  name: string;
  path: string;
  type: "file" | "directory";
};

export async function listFilesTool(
  projectRoot: string,
  relDir = ".",
  recursive = false
): Promise<FileEntry[]> {
  const root = path.join(projectRoot, relDir);

  async function walk(dir: string, base: string): Promise<FileEntry[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const result: FileEntry[] = [];

    for (const entry of entries) {
      const abs = path.join(dir, entry.name);
      const rel = path.join(base, entry.name).replace(/\\/g, "/");

      if (entry.isDirectory()) {
        result.push({
          name: entry.name,
          path: rel,
          type: "directory",
        });

        if (recursive) {
          result.push(...(await walk(abs, rel)));
        }
      } else {
        result.push({
          name: entry.name,
          path: rel,
          type: "file",
        });
      }
    }

    return result;
  }

  return walk(root, relDir === "." ? "" : relDir);
}