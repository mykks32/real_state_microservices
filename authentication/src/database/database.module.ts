import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from '../config/config.service';
import { User } from './entities/user.entity';
import * as path from 'path';

/** Database module with dynamic config */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        type: 'postgres',
        host: config.dbHost,
        port: config.dbPort,
        username: config.dbUser,
        database: config.dbName,
        entities: [User],
        migrations: [path.join(__dirname, './migrations/*{.ts,.js}')],
        migrationsTableName: 'migrations',
        migrationsRun: true,
        synchronize: false,
        logging: false,
      }),
    }),
  ],
  providers: [AppConfigService],
  exports: [TypeOrmModule, AppConfigService],
})
export class DBModule {}
