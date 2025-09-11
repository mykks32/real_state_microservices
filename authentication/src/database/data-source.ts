import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import { User } from 'src/user/user.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'real_state_pg',
  logging: false,
  synchronize: false,
  entities: [User],
  migrations: [path.join(__dirname, './migrations/*{.ts,.js}')],
  migrationsTableName: 'migrations',
  migrationsRun: false,
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;