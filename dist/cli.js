#!/usr/bin/env node

// scripts/cli.ts
import { Command } from "commander";

// terminalui/greet.ts
import { select as select2, isCancel as isCancel2 } from "@clack/prompts";
import chalk2 from "chalk";
import figlet from "figlet";

// modes/cliMode.ts
import chalk from "chalk";
import { select, isCancel } from "@clack/prompts";
async function runClimode() {
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
      console.log(chalk.blue("\nAgent based mode"));
    } else if (mode === "plan") {
      console.log(chalk.blue("\nPlan based mode"));
    } else if (mode === "ask") {
      console.log(chalk.blue("\nAsk mode"));
    } else {
      console.log(chalk.yellow("\n choose a valid mode"));
    }
  }
}

// terminalui/greet.ts
var BANNER_FONT = "ANSI Shadow";
var SHADOW = chalk2.hex("#5b4d9e");
var FACE = chalk2.hex("#e8dcf8").bold;
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
  } catch (error) {
    name = figlet.textSync("AutoMat", { font: "Standard" });
  }
  printBannerWithShadow(name);
  const mode = await select2({
    message: "Select a mode",
    options: [
      {
        label: "cli",
        value: "cli"
      },
      {
        label: "telegram",
        value: "telegram"
      },
      {
        label: "exit",
        value: "Exit"
      }
    ]
  });
  if (isCancel2(mode) || mode === "Exit") {
    console.log(chalk2.dim("Exiting..."));
    process.exit(0);
  }
  if (mode === "cli") {
    console.log(chalk2.dim("Starting cli mode..."));
    await runClimode();
  } else if (mode === "telegram") {
    console.log(chalk2.dim("Starting telegram mode..."));
  }
}

// scripts/cli.ts
var program = new Command();
program.name("AutoMat").description("CLI for AutoMat").version("1.0.0");
program.command("greet").description("Show the banner and pick cli or telegram").action(async () => {
  await runGreet();
});
await program.parseAsync(process.argv);
