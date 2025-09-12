import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty } from "class-validator";

export class AdminAuthDto {
  @ApiProperty({
    description: "User's email address",
    example: "user@example.com",
    format: "email",
  })
  @IsNotEmpty({ message: "Email should not be empty" })
  @IsEmail({}, { message: "Invalid email format" })
  readonly email: string;

  @ApiProperty({
    description: "User's password",
    example: "P@ssw0rd123",
    minLength: 8,
  })
  @IsNotEmpty({ message: "Password should not be empty" })
  readonly password: string;

  @ApiProperty({
    description: "Whether to remember the session",
    example: true,
    type: Boolean,
  })
  @IsBoolean({ message: "Remember me should be boolean" })
  readonly rememberMe: boolean;
}
