import { CommandLineCommand, PreCondition, ProcessRunner } from "@everyonesoftware/common";

export function addBuildCommand(parent: CommandLineCommand, processRunner: ProcessRunner): void
{
    PreCondition.assertNotUndefinedAndNotNull(parent, "parent");
    PreCondition.assertNotUndefinedAndNotNull(processRunner, "processRunner");

    const buildCommand: CommandLineCommand = parent.addCommand({
        name: "build",
        description: "Build the software project that contains the current folder.",
    });
    buildCommand.setAction(() => processRunner.start("npm run build"));
}