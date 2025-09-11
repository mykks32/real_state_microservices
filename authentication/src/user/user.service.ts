import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { IUser } from './user.interface';

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
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findById({ id }: Pick<IUser, 'id'>): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }
}
