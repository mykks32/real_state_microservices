import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { IUser } from 'src/modules/auth/interfaces/user.interface';
import { Role } from 'src/modules/auth/enums/roles.enum';

export class CreateUserDto
  implements Pick<IUser, 'email' | 'username' | 'password' | 'roles'>
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

  @ApiProperty({
    description: 'User roles (defaults to BUYER if not provided)',
    example: [Role.BUYER],
    isArray: true,
    enum: [Role.BUYER, Role.SELLER],
    required: false,
    default: [Role.BUYER],
  })
  @IsOptional()
  @IsEnum(Role, {
    each: true,
    message: 'Each role must be either BUYER or SELLER',
  })
  roles: Role[] = [Role.BUYER];
}
