import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';


export class VerificationLinkDTO {

  @IsNotEmpty({ message: `Email should not be empty!` })
  @IsEmail({}, { message: `Invalid email format!` })
  readonly email: string;

  @IsNotEmpty({ message: `Company name can't be empty! ` })
  @MinLength(6, {
    message: `Company name length more than 6 characters`
  })
  readonly companyName: string;
}
