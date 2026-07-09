import { select, isCancel } from "@clack/prompts";
import chalk from "chalk";
import figlet from "figlet";
import { runCliMode } from "../modes/cliMode.js";

const BANNER_FONT = "ANSI Shadow";
const SHADOW = chalk.hex("#5b4d9e");
const FACE = chalk.hex("#e8dcf8").bold;

function printBannerWithShadow(ascii: string) {
  const bannerLines = ascii.replace(/\s+$/, "").split("\n");
  const maxLen = Math.max(...bannerLines.map((l) => l.length), 0);
  const rowWidth = maxLen + 2;

  for (const line of bannerLines) {
    console.log(SHADOW(("  " + line).padEnd(rowWidth)));
  }

  process.stdout.write(`\x1b[${bannerLines.length}A`);

  for (const line of bannerLines) {
    console.log(FACE(line.padEnd(rowWidth)));
  }

  console.log();
}

export async function runGreet() {
  let name: string;

  try {
    name = figlet.textSync("AutoMat", { font: BANNER_FONT });
  } catch {
    name = figlet.textSync("AutoMat", { font: "Standard" });
  }

  printBannerWithShadow(name);

  const mode = await select({
    message: "Select a mode",
    options: [
      { label: "CLI", value: "cli" },
      { label: "Telegram", value: "telegram" },
      { label: "Exit", value: "exit" },
    ],
  });

  if (isCancel(mode) || mode === "exit") {
    console.log(chalk.dim("Exiting..."));
    process.exit(0);
  }

  if (mode === "cli") {
    console.log(chalk.dim("Starting CLI mode..."));
    await runCliMode();
  } else if (mode === "telegram") {
    console.log(chalk.dim("Starting Telegram mode..."));
  }
}