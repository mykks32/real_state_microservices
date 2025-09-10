import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from '../user/dtos/login.dto';
import { IUsers } from './interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from 'src/auth/jwt.service';
import { filter } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  async create(data: CreateUserDto): Promise<IUsers> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const user = this.usersRepository.create({
      ...data,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async login(data: LoginUserDto): Promise<{ accessToken: string }> {
    const { email, username, password } = data;

    const userData = await this.usersRepository.findOne({
      where: email ? { email } : { username },
    });

    if (!userData) {
      throw new NotFoundException('No user data found');
    }

    const isPasswordValid = bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password not correct');
    }
    userData.lastLoginAt = new Date();

    await this.usersRepository.save(userData);
    const { password: password1, ...user } = userData;

    return { accessToken: this.jwtService.sign(user.id) };
  }

  async findOne(id: string): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }
}
