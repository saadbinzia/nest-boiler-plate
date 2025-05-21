import { IsBoolean, IsEmail, IsNotEmpty } from "class-validator";

export class AuthDto {
  @IsNotEmpty({ message: "Email should not be empty" })
  @IsEmail({}, { message: "Invalid email format" })
  readonly email: string;

  @IsNotEmpty({ message: "Password should not be empty" })
  readonly password: string;

  @IsBoolean({ message: "Remember me should be boolean" })
  readonly rememberMe: boolean;
}
