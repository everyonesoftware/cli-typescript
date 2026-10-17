import { CharacterWriteStream, CommandLineCommand, escapeAndQuote, Folder, PreCondition } from "@everyonesoftware/common";

export function addCleanCommand(parent: CommandLineCommand, output: CharacterWriteStream, currentFolder: Folder): void
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