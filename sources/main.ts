import { CharacterWriteStream, CurrentProcess } from "@everyonesoftware/common-typescript";

CurrentProcess.run(async (process: CurrentProcess) =>
{
    const output: CharacterWriteStream = process.getOutputWriteStream();
    await output.writeLine("Hello World!");
});