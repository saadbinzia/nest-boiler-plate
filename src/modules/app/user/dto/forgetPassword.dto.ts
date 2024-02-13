import { IsEmail, IsNotEmpty } from 'class-validator';


export class ForgetPasswordDTO {

  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Invalid email format' })
    readonly email: string;

}
