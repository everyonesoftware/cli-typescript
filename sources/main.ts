#!/usr/bin/env node

import { CharacterWriteStream, CommandLineCommand, CurrentProcess, join, CommandLineParameter, PreCondition, Folder, escapeAndQuote } from "@everyonesoftware/common";
import { ProcessRunner } from "./ProcessRunner.js";
import { RealProcessRunner } from "./RealProcessRunner.js";
import { addFixImportsCommand } from "./FixImports.js";

function addBuildCommand(parent: CommandLineCommand, processRunner: ProcessRunner): void
{
    PreCondition.assertNotUndefinedAndNotNull(parent, "parent");
    PreCondition.assertNotUndefinedAndNotNull(processRunner, "processRunner");

    const buildCommand: CommandLineCommand = parent.addCommand({
        name: "build",
        description: "Build the software project that contains the current folder.",
    });
    buildCommand.setAction(() => processRunner.start("npm run build"));
}

function addCleanCommand(parent: CommandLineCommand, output: CharacterWriteStream, currentFolder: Folder): void
{
    PreCondition.assertNotUndefinedAndNotNull(parent, "parent");
    PreCondition.assertNotUndefinedAndNotNull(output, "output");
    PreCondition.assertNotUndefinedAndNotNull(currentFolder, "currentFolder");

    const cleanCommand: CommandLineCommand = parent.addCommand({
        name: "clean",
        description: "Clean the current project's output folders.",
    });
    cleanCommand.setAction(async () =>
    {
        const outputsFolder: Folder = currentFolder.getFolder("outputs").await();
        if (!await outputsFolder.exists())
        {
            await output.writeLine("Nothing to clean.");
        }
        else
        {
            await output.writeLine(`Deleting ${escapeAndQuote(outputsFolder.getName())} folder...`);
            await outputsFolder.delete();
            await output.writeLine("Done");
        }
    });
}

function addTestCommand(parent: CommandLineCommand, processRunner: ProcessRunner): void
{
    PreCondition.assertNotUndefinedAndNotNull(parent, "parent");
    PreCondition.assertNotUndefinedAndNotNull(processRunner, "processRunner");

    const testCommand: CommandLineCommand = parent.addCommand({
        name: "test",
        description: "Test the software project that contains the current folder.",
    });
    testCommand.setAction(() => processRunner.start("npm test"));
}

function addEchoCommand(parent: CommandLineCommand, output: CharacterWriteStream): void
{
    const echoCommand: CommandLineCommand = parent.addCommand({
        name: "echo",
        description: "A command that will echo the command line arguments.",
    });
    const reverse: CommandLineParameter = echoCommand.addParameter({
        name: "reverse",
        description: "Reverse the arguments.",
        defaultValue: {
            notFound: "false",
            valueNotFound: "true",
        },
    });
    echoCommand.setAction(async () =>
    {
        const commandArgs: string[] = parent.getArguments().skip(1).toArray().await();
        if (reverse.getBooleanValue().await())
        {
            commandArgs.reverse();
        }
        await output.writeLine(join(" ", commandArgs));
    });
}

CurrentProcess.run(async (process: CurrentProcess) =>
{
    const output: CharacterWriteStream = process.getOutputWriteStream();
    const processRunner: ProcessRunner = RealProcessRunner.create();
    const currentFolder: Folder = process.getCurrentFolder();

    const command: CommandLineCommand = CommandLineCommand.create({
        name: "everyone",
        description: "An extensible command line application for the everyone software ecosystem.",
        aliases: ["e1"],
        arguments: process.getArguments().skip(2),
        writeStream: output,
    });

    addEchoCommand(command, output);
    addBuildCommand(command, processRunner);
    addCleanCommand(command, output, currentFolder);
    addTestCommand(command, processRunner);
    addFixImportsCommand(command, output);

    return await command.run();
});