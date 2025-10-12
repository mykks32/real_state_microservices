import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';
import { IUser } from 'src/auth/interfaces/user.interface';

export class LoginUserDto implements Pick<IUser, 'email' | 'password'> {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    required: true,
  })
  @IsEmail({}, { message: 'Email must be valid' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'P@ssw0rd123',
    required: true,
  })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
