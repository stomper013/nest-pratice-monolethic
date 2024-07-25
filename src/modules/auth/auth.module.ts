import { User } from '@core/database/entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { LoggerModule } from '@core/utils';
import { AuthController } from './auth.controller';

@Module({
  imports: [MikroOrmModule.forFeature([User]), LoggerModule],
  controllers: [AuthController],
})
export class AuthModule {}
