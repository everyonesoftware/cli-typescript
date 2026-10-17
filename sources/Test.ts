import { CommandLineCommand, PreCondition, ProcessRunner } from "@everyonesoftware/common";

export function addTestCommand(parent: CommandLineCommand, processRunner: ProcessRunner): void
{
    PreCondition.assertNotUndefinedAndNotNull(parent, "parent");
    PreCondition.assertNotUndefinedAndNotNull(processRunner, "processRunner");

    const testCommand: CommandLineCommand = parent.addCommand({
        name: "test",
        description: "Test the software project that contains the current folder.",
    });
    testCommand.setAction(() => processRunner.start("npm test"));
}