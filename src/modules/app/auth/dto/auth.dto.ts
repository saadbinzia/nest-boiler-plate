import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';


export class AuthDto {

  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Invalid email format' })
    readonly email: string;

    @IsNotEmpty()
    @MinLength(6, {
      message: 'Password length more than 6 characters'
    })
    readonly password: string;
}
