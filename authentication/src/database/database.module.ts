import { Module } from '@nestjs/common';
import AppDataSource from './data-source';

@Module({})
export class DBModule {
  constructor() {
    AppDataSource.initialize()
      .then(() => console.log('Database connected successfully'))
      .catch((err) => console.error('Error connecting to database', err));
  }
}
