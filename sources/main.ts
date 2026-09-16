#!/usr/bin/env node

import { CharacterWriteStream, CommandLineCommand, CurrentProcess, join, CommandLineParameter } from "@everyonesoftware/common";

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

    const command: CommandLineCommand = CommandLineCommand.create({
        name: "everyone",
        description: "An extensible command line application for the everyone software ecosystem.",
        aliases: ["e1"],
        arguments: process.getArguments().skip(2),
        writeStream: output,
    });

    addEchoCommand(command, output);

    return await command.run();
});