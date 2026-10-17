import { CommandLineCommand, PreCondition, ProcessRunner } from "@everyonesoftware/common";

export function addRunCommand(parent: CommandLineCommand, processRunner: ProcessRunner): void
{
    PreCondition.assertNotUndefinedAndNotNull(parent, "parent");
    PreCondition.assertNotUndefinedAndNotNull(processRunner, "processRunner");

    const buildCommand: CommandLineCommand = parent.addCommand({
        name: "run",
        description: "Run the software project in the current folder.",
    });
    buildCommand.setAction(() => processRunner.start("node ."));
}