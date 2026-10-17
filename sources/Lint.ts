import { CommandLineCommand, PreCondition, ProcessRunner } from "@everyonesoftware/common";

export function addLintCommand(parent: CommandLineCommand, processRunner: ProcessRunner): void
{
    PreCondition.assertNotUndefinedAndNotNull(parent, "parent");
    PreCondition.assertNotUndefinedAndNotNull(processRunner, "processRunner");

    const buildCommand: CommandLineCommand = parent.addCommand({
        name: "lint",
        description: "Run the linter to look for code errors.",
    });
    buildCommand.setAction(() => processRunner.start("npx oxlint"));
}