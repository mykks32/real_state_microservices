import { IsNotEmpty, ValidateIf, IsEmail } from 'class-validator';
import { BaseRequestDto } from 'src/common/dtos/base-request.dto';
import { IUser } from 'src/user/user.interface';

export class LoginUserDto
  extends BaseRequestDto
  implements Pick<IUser, 'email' | 'password'>
{
  @IsEmail({}, { message: 'Email must be valid' })
  @IsNotEmpty({ message: 'Email is requiered' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
