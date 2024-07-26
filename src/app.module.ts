import { LoggerModule } from '@core/utils';
import configuration from '@core/config/configuration';
import { DatabaseModule } from '@core/database';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'modules/auth';
import { TaskModule } from 'modules/task';
import { UserModule } from 'modules/user/user.module';

const appModules = [AuthModule, UserModule, TaskModule];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    LoggerModule,
    ...appModules,
  ],
})
export class AppModule {}
