import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsIn,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { GlobalEnums } from "src/core/config/globalEnums";

const { USER_ROLES } = GlobalEnums;

export class CreateUserDto {
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

  @ApiProperty({ example: "password123", description: "User password" })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.USER,
    description: "User role",
  })
  @IsString()
  @IsIn(Object.values(USER_ROLES))
  role: string = USER_ROLES.USER;
}
