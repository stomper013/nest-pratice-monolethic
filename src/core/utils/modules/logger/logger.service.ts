import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  protected context?: string;
  constructor() {
    super();
  }

  setContext(context: string) {
    super.setContext(context);
    this.context = context;
  }

  log(message: any) {
    super.log(message, this.context);
  }

  error(message: any) {
    super.error(message, '', this.context);
  }

  warn(message: any) {
    super.warn(message, this.context);
  }

  verbose(message: any) {
    super.verbose(message, this.context);
  }
}
