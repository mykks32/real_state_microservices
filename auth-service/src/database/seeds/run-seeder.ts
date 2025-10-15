import { AppDataSource } from '../data-source';
import { seedAdminUser } from './admin.seeder';

async function runSeeder() {
  try {
    await AppDataSource.initialize();
    await seedAdminUser(AppDataSource);
  } catch (error) {
    console.error('Seeder failed:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

runSeeder().catch((error) => {
  console.error('Seeder failed:', error);
  process.exit(1); // exit with failure code if needed
});
