import { User } from '@core/database/entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { CryptoModule, LoggerModule } from '@core/utils';
import { UserService } from './user.service';

@Module({
  imports: [MikroOrmModule.forFeature([User]), LoggerModule, CryptoModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
