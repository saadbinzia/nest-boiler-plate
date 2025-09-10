import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

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
  firstName: string;

  @ApiProperty({ example: "Doe", description: "User last name" })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: "+1234567890",
    description: "User phone number",
    required: false,
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

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
