import { IsNotEmpty, MinLength } from 'class-validator';


export class VerifyResetPasswordCodeDTO {

  @IsNotEmpty({ message: 'Email should not be empty' })
  @MinLength(6, { message: 'Invalid code length' })
  readonly resetCode: string;

}
