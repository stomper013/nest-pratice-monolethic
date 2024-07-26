import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import options from '../orm.config';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get('db.postgres');
        return Object.assign(options, dbConfig, {
          entitiesTs: [join(__dirname, '../**/*.entity.ts')],
        });
      },
    }),
  ],
})
export class DatabaseModule {}
