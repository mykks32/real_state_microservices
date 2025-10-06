import { DataSourceOptions } from 'typeorm';
import * as path from 'path';
import { User } from './entities/user.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'real_state_pg',
  logging: false,
  synchronize: true,
  entities: [User],
  migrations: [path.join(__dirname, './migrations/*{.ts,.js}')],
  migrationsTableName: 'migrations',
  migrationsRun: true,
};
