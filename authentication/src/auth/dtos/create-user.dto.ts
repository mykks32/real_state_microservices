import { IsEmail, IsNotEmpty, ValidateIf } from 'class-validator';
import { BaseRequestDto } from 'src/common/dtos/base-request.dto';
import { IUser } from 'src/user/user.interface';

export class CreateUserDto
  extends BaseRequestDto
  implements Pick<IUser, 'email' | 'username' | 'password'>
{
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
