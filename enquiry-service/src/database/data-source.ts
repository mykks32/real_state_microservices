import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import { Enquiry } from './entities/enquiry.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'real_state_enquiries',
  logging: false,
  synchronize: true,
  // entities: [__dirname + '/**/*.entity{.ts,.js}'],
  entities: [Enquiry],
  migrations: [path.join(__dirname, './migrations/*{.ts,.js}')],
  migrationsTableName: 'migrations',
  migrationsRun: true,
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
