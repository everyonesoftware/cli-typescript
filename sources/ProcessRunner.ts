import { AsyncResult } from "@everyonesoftware/common";

/**
 * A type that can be used to start new operating system processes.
 */
export abstract class ProcessRunner
{
    /**
     * Start a new process that will invoke the provided shell command.
     * @param shellCommand The shell command to run.
     */
    public abstract start(shellCommand: string): AsyncResult<number>;
}