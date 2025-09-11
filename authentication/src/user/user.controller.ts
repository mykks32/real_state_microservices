import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class userController {
  constructor(private userService: UserService) {}

  @Get(':id')
  async findUserById(@Param('id') id: string) {
    return this.userService.findById({ id });
  }

  @Get('/email/:email')
  async findUserByEmail(@Param('email') email: string) {
    return this.userService.findByEmail({ email });
  }
}
