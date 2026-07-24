import { listFilesTool } from "./list-files.js";

export async function findFileTool(
  projectRoot: string,
  filename: string
) {
  const files = await listFilesTool(projectRoot, ".", true);

  const matches = files.filter(
    (file) =>
      file.type === "file" &&
      file.name.toLowerCase() === filename.toLowerCase()
  );
  return matches;
}