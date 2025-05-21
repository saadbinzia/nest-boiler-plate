import { IsEnum, IsNotEmpty, IsOptional, Matches } from "class-validator";

/**
 * Social Login DTO (Data Transfer Object)
 * @description Social Login DTO is utilized to validate the Social Login request data before invoking the controller function.
 * Used at the beginning of the process.
 */
export class SocialSignUpDTO {
  @IsNotEmpty({ message: "Email should not be empty" })
  readonly email: string;

  @IsNotEmpty({ message: "First name should not be empty" })
  @Matches(/^[A-Za-z\s]+$/, {
    message: "First name should contain only alphabets and spaces",
  })
  readonly firstName: string;

  @IsNotEmpty({ message: "Last name should not be empty" })
  @Matches(/^[A-Za-z\s]+$/, {
    message: "Last name should contain only alphabets and spaces",
  })
  readonly lastName: string;

  @IsOptional()
  readonly phoneNumber: string;

  @IsOptional()
  readonly referralUser: string;

  @IsOptional()
  readonly preferredLanguage: string;

  @IsNotEmpty({ message: "Social media type should not be empty" })
  @IsEnum(["facebook", "google", "apple", "twitter"], {
    message: 'Type should be "google", "twitter", "apple" or "facebook"',
  })
  readonly type: string;

  readonly socialLoginData: {
    account: {
      id_token: string;
    };
    profile: object;
  };
}
