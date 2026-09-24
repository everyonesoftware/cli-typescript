#!/usr/bin/env node

import { CharacterWriteStream, CommandLineCommand, CurrentProcess, join, CommandLineParameter, isUndefinedOrNull, NotFoundError } from "@everyonesoftware/common";
import { spawn } from "node:child_process";

class ProcessTerminatedError extends Error
{
    public readonly signal: NodeJS.Signals;

    public constructor(signal: NodeJS.Signals)
    {
        super(`Process terminated by signal: ${signal}`);

        this.signal = signal;
    }
}

function addBuildCommand(parent: CommandLineCommand): void
{
    const buildCommand: CommandLineCommand = parent.addCommand({
        name: "build",
        description: "Build the software project that contains the current folder.",
    });
    buildCommand.setAction(() =>
    {
        return new Promise((resolve, reject) =>
        {
            const process = spawn("npm run build", {
                stdio: "inherit",
                shell: true,
            });
            process.once("error", reject);
            process.once("exit", (code: number | null, signal: NodeJS.Signals | null) =>
            {
                if (!isUndefinedOrNull(signal))
                {
                    reject(new ProcessTerminatedError(signal));
                }
                else if (isUndefinedOrNull(code))
                {
                    reject(new NotFoundError(`Neither a code or signal was provided when the process ended.`));
                }
                else
                {
                    resolve(code);
                }
            });
        });
    });
}

function addTestCommand(parent: CommandLineCommand): void
{
    const buildCommand: CommandLineCommand = parent.addCommand({
        name: "test",
        description: "Test the software project that contains the current folder.",
    });
    buildCommand.setAction(() =>
    {
        return new Promise((resolve, reject) =>
        {
            const process = spawn("npm test", {
                stdio: "inherit",
                shell: true,
            });
            process.once("error", reject);
            process.once("exit", (code: number | null, signal: NodeJS.Signals | null) =>
            {
                if (!isUndefinedOrNull(signal))
                {
                    reject(new ProcessTerminatedError(signal));
                }
                else if (isUndefinedOrNull(code))
                {
                    reject(new NotFoundError(`Neither a code or signal was provided when the process ended.`));
                }
                else
                {
                    resolve(code);
                }
            });
        });
    });
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

    const command: CommandLineCommand = CommandLineCommand.create({
        name: "everyone",
        description: "An extensible command line application for the everyone software ecosystem.",
        aliases: ["e1"],
        arguments: process.getArguments().skip(2),
        writeStream: output,
    });

    addEchoCommand(command, output);
    addBuildCommand(command);
    addTestCommand(command);

    return await command.run();
});