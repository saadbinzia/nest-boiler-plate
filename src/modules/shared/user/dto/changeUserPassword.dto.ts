import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";

/**
 * Change User Password DTO (Data Transfer Object)
 */
export class ChangeUserPasswordDTO {
  @ApiProperty({
    description: "Current (old) password of the user",
    example: "OldP@ssw0rd123",
  })
  @IsNotEmpty({ message: "Old password should not be empty" })
  readonly oldPassword: string;

  @ApiProperty({
    description:
      "New password. Must be 8-32 characters, contain at least one uppercase letter, one number, and one symbol.",
    example: "NewP@ssw0rd123",
    minLength: 8,
    maxLength: 32,
    pattern: "^(?=.*\\d)(?=.*[A-Z])(?=.*[\\W_]).{8,32}$",
  })
  @IsNotEmpty({ message: "New password should not be empty" })
  @MinLength(8, { message: "Password should be at least 8 characters long." })
  @MaxLength(32, { message: "Password can't be more than 32 characters." })
  @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).{8,32}$/, {
    message:
      "Password must contain at least one number, one uppercase letter, and one symbol.",
  })
  readonly newPassword: string;
}
