import { IUser } from 'src/auth/interfaces/user.interface';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * DTO for user registration.
 *
 * Includes email, username, and password fields.
 */
export class CreateUserDto
  implements Pick<IUser, 'email' | 'username' | 'password'>
{
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    required: true,
  })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @ApiProperty({
    description: 'Username',
    example: 'srikriydv',
    required: true,
  })
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @ApiProperty({
    description: 'User password',
    example: 'P@ssw0rd123',
    required: true,
  })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
