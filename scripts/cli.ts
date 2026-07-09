#!/usr/bin/env node
import "dotenv/config";
import { Command } from "commander";
import { runGreet } from "../terminalui/greet";

const program = new Command();

program
    .name("AutoMat")
    .description("Autonomous coding assistant")
    .version("1.0.0");

program
    .command("run")
    .description("Show the banner and pick cli or telegram")
    .action(async () => {
        await runGreet();
    });

await program.parseAsync(process.argv);