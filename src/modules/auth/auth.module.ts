import { User } from '@core/database/entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CryptoModule, LoggerModule } from '@core/utils';
import { AuthController } from './auth.controller';
import { UserModule } from 'modules/user';
import { AuthService, JwtService } from './services';

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    LoggerModule,
    CryptoModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
