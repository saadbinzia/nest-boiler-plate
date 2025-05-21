/**
 * Create User Verification Code Interface
 * @description To define types for fields of Create User Verification Code
 */
export interface CreateUserVerificationCodeInterface {
  codeStatus: VerificationCodeStatusEnum;
  type: VerificationCodeTypeEnum;
  code: string;
  userId: number;
}

/**
 * Code Status Enum
 * @description Possible statuses for code status column in user verification code table
 */
export enum VerificationCodeStatusEnum {
  SENT = "SENT",
  VALIDATED = "VALIDATED",
  EXPIRED = "EXPIRED",
}

/**
 * Type Enum
 * @description Possible values for type column in user verification code table
 */
export enum VerificationCodeTypeEnum {
  FORGET_PASSWORD = "FORGET_PASSWORD",
  REGISTRATION = "REGISTRATION",
}
