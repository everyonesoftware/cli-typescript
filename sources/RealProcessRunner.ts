import { AsyncResult, isUndefinedOrNull, NotFoundError, PreCondition } from "@everyonesoftware/common";
import { ProcessRunner } from "./ProcessRunner.js";
import { spawn } from "child_process";
import { ProcessTerminatedError } from "./ProcessTerminatedError.js";

export class RealProcessRunner implements ProcessRunner
{
    private constructor()
    {
    }

    public static create(): RealProcessRunner
    {
        return new RealProcessRunner();
    }

    public start(shellCommand: string): AsyncResult<number>
    {
        PreCondition.assertNotEmpty(shellCommand, "shellCommand");

        return AsyncResult.create(new Promise<number>((resolve, reject) =>
        {
            const process = spawn(shellCommand, {
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
        }));
    }
}