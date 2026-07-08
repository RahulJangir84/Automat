#!/usr/bin/env node
import { Command } from "commander";
import { runGreet } from "../terminalui/greet.js";

const program = new Command();

program
    .name("AutoMat")
    .description("CLI for AutoMat")
    .version("1.0.0");

program
    .command("greet")
    .description("Show the banner and pick cli or telegram")
    .action(async () => {
        await runGreet();
    });

await program.parseAsync(process.argv);