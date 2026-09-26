/**
 * An {@link Error} that occurs when a process is terminated via an operating system signal.
 */
export class ProcessTerminatedError extends Error
{
    public readonly signal: NodeJS.Signals;

    public constructor(signal: NodeJS.Signals)
    {
        super(`Process terminated by signal: ${signal}`);

        this.signal = signal;
    }
}