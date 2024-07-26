import configuration from '@core/config/configuration';
import { DatabaseModule } from '@core/database';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'modules/auth';
import { UserModule } from 'modules/user/user.module';

const appModules = [UserModule, AuthModule];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    ...appModules,
  ],
})
export class AppModule {}
