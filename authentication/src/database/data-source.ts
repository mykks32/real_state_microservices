import path from 'path';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  //   url: '',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'real_state_pg',
  logging: false,
  synchronize: true,
  entities: [],
  migrations: [path.join(__dirname, './database/migrations/*.{ts,js}')],
  migrationsTableName: 'migrations',
  migrationsRun: false,
});

export default AppDataSource;
