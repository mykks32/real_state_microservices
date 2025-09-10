import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { IUsers } from './interfaces/user.interface';
import { LoginUserDto } from './dtos/login.dto';

@Controller('auth')
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto): Promise<IUsers> {
    return this.authService.create(createUserDto);
  }

  @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
      return this.authService.login(loginUserDto);
    }

  @Get('id/:id')
  async findAccount(@Param('id') id: string) {
    return this.authService.findById(id);
  }

  @Get('email/:email')
  async findAccountByEmail(@Param('email') email: string) {
    return this.authService.findByEmail(email)
  }
}
