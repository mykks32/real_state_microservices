import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { Repository } from 'typeorm';
import { IUser } from './user.interface';
import { isUUID } from 'class-validator';
import { UserNotFoundException } from 'src/common/exceptions/user-not-found.exception';

@Injectable()
export class UserService {
  private readonly logger = new Logger('User Service');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    data: Pick<IUser, 'username' | 'email' | 'password'>,
  ): Promise<User> {
    const user = this.userRepository.create(data);

    this.logger.log(`User created with id: ${user.id}`);
    return this.userRepository.save(user);
  }

  async findByEmail({ email }: Pick<IUser, 'email'>): Promise<User | null> {
    const userData = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (userData) {
      this.logger.log(`User retrived of email: ${userData.email}`);
    } else {
      this.logger.log(`User don't exist on email ${email}`);
    }

    return userData;
  }

  async findById({ id }: Pick<IUser, 'id'>): Promise<User> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new UserNotFoundException();

    this.logger.log(`User retrived with id: ${user.id}`);
    return user;
  }
}
