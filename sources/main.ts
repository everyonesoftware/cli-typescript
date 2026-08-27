import { CharacterWriteStream, CommandLineParameters, CurrentProcess, Iterable } from "@everyonesoftware/common";

CurrentProcess.run(async (process: CurrentProcess) =>
{
    const output: CharacterWriteStream = process.getOutputWriteStream();
    await output.writeLine("Hello World!");

    const args: Iterable<string> = process.getArguments();
    await output.writeLine(`Arguments (${await args.getCount()}): ${args.toString()}`);

    const parameters: CommandLineParameters = process.getParameters();
    parameters.add("apple")
        .addAlias("a")
        .setDescription("A parameter named 'apple'.");
    parameters.add("banana")
        .addAliases(["b", "bna"])
        .setDescription("A parameter named 'b'.");


});