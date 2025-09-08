import { IsNotEmpty, ValidateIf, IsEmail } from 'class-validator';

export class LoginUserDto {
    @ValidateIf((o) => !o.username)
    @IsEmail({}, { message: 'Email must be valid if username is not provided' })
    email?: string;

    @ValidateIf((o) => !o.email)
    @IsNotEmpty({ message: 'Username is required if email is not provided' })
    username?: string;

    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}