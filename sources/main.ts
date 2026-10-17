#!/usr/bin/env node

import { CharacterWriteStream, CommandLineCommand, CurrentProcess, Folder, ProcessRunner } from "@everyonesoftware/common";
import { addFixImportsCommand } from "./FixImports.js";
import { addCleanCommand } from "./Clean.js";
import { addBuildCommand } from "./Build.js";
import { addTestCommand } from "./Test.js";
import { addLintCommand } from "./Lint.js";
import { addRunCommand } from "./Run.js";

CurrentProcess.run(async (process: CurrentProcess) =>
{
    const output: CharacterWriteStream = process.getOutputWriteStream();
    const processRunner: ProcessRunner = process.getProcessRunner();
    const currentFolder: Folder = process.getCurrentFolder();

    const command: CommandLineCommand = CommandLineCommand.create({
        name: "everyone",
        description: "An extensible command line application for the everyone software ecosystem.",
        aliases: ["e1"],
        arguments: process.getArguments().skip(2),
        writeStream: output,
    });

    addCleanCommand(command, output, currentFolder);
    addLintCommand(command, processRunner);
    addBuildCommand(command, processRunner);
    addTestCommand(command, processRunner);
    addRunCommand(command, processRunner);
    addFixImportsCommand(command, output);

    return await command.run();
});