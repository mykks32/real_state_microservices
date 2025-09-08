import { IsEmail, IsNotEmpty, ValidateIf } from 'class-validator';
import { IUser } from '../interfaces/user.interface';

export class CreateUserDto implements Partial<IUser> {
    @ValidateIf((o) => !o.username)
    @IsEmail({}, { message: 'Email must be valid if username is not provided' })
    email?: string;

    @ValidateIf((o) => !o.email)
    @IsNotEmpty({ message: 'Username is required if email is not provided' })
    username?: string;

    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}
