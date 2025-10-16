import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';
import * as path from 'path';
import { Enquiry } from './entities/enquiry.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => {
        return {
          type: 'postgres' as const,
          url: config.dbUrl,
          entities: [Enquiry],
          migrations: [path.join(__dirname, './migrations/*{.ts,.js}')],
          migrationsTableName: 'migrations',
          migrationsRun: true,
          synchronize: false,
          logging: true,
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DBModule {}
