import { DataSource, Raw } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { Role } from '../enums/roles.enum';

export async function seedAdminUser(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  const existingAdmin = await userRepository.findOne({
    where: {
      roles: Raw((alias) => `${alias} @> ARRAY['ADMIN']::user_roles_enum[]`),
    },
  });

  if (existingAdmin) {
    console.log('Admin user already exists');
    return;
  }

  const adminPassword = 'admin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = userRepository.create({
    email: 'admin@example.com',
    username: 'admin',
    password: hashedPassword,
    roles: [Role.ADMIN],
  });

  await userRepository.save(adminUser);
  console.log('Admin user seeded successfully');
}
