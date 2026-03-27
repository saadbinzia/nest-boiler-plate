import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateSocialUserDto {
  @ApiProperty({
    example: "user@example.com",
    description: "User email address",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "John", description: "User first name" })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: "google", description: "Social login provider" })
  @IsString()
  @IsNotEmpty()
  provider: string;

  @ApiProperty({
    example: "1234567890",
    description: "Social provider user ID",
  })
  @IsString()
  @IsNotEmpty()
  providerId: string;
}
