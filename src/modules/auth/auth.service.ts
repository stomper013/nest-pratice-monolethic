import { BaseRepository } from '@core/database';
import { LoggerService } from '@core/utils';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService extends BaseRepository {
  private readonly serviceName: string = AuthService.name;
  private readonly logger: LoggerService;
  constructor(logger: LoggerService) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }
}
