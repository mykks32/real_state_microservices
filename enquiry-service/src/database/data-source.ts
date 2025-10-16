import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { Enquiry } from './entities/enquiry.entity';

dotenv.config(); // load .env for CLI

/** Base options reused in NestJS runtime */
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Enquiry],
  migrations: [path.join(__dirname, './migrations/*{.ts,.js}')],
  migrationsTableName: 'migrations',
  migrationsRun: true,
  synchronize: false,
};

export const AppDataSource = new DataSource(dataSourceOptions);
