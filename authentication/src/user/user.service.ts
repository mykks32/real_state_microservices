import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { IUser } from './user.interface';
import { isUUID } from 'class-validator';
import { UserNotFoundException } from 'src/common/exceptions/user-not-found.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    data: Pick<IUser, 'username' | 'email' | 'password'>,
  ): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async findByEmail({ email }: Pick<IUser, 'email'>): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findById({ id }: Pick<IUser, 'id'>): Promise<User> {
    try {
      if (!isUUID(id)) {
        throw new BadRequestException('Invalid user ID format');
      }

      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) throw new UserNotFoundException()

      return user;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new BadRequestException('Failed to fetch user');
    }
  }
}
