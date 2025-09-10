import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { IUsers } from './interfaces/user.interface';
import { LoginUserDto } from '../user/dtos/login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto): Promise<IUsers> {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Get(':id')
  async findAccount(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
