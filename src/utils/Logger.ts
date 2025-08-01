export class Logger {
  private static getCallerName(): string {
    const stack = new Error().stack;
    if (!stack) return 'Unknown';

    const lines = stack.split('\n');
    for (let i = 4; i < lines.length; i++) {
      const match = lines[i].match(/\/([^\/]+)\.(t|j)sx?/);
      if (match) return match[1];
    }

    return 'Unknown';
  }

  private static printWithStack(level: 'log' | 'warn' | 'error', message: string) {
    const caller = this.getCallerName();
    const tag = `[${caller}] ${message}`;

    console.groupCollapsed(tag);
    console[level](tag);
    console.trace();
    console.groupEnd();
  }

  static log(message: string) {
    if (import.meta.env.DEV)
      this.printWithStack('log', message);
  }

  static warn(message: string) {
    if (import.meta.env.DEV)
      this.printWithStack('warn', message);
  }

  static error(message: string) {
    if (import.meta.env.DEV)
      this.printWithStack('error', message);
  }
}
