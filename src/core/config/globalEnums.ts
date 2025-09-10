import { Injectable } from "@nestjs/common";

/**
 * GlobalEnums
 *
 * @description need to put all global enums - things that we are going to use through out the app like user session response
 */
@Injectable()
export class GlobalEnums {
  /**
   * @description Statuses for user tokens in user sessions table.
   */
  static readonly USER_SESSION_STATUS = {
    EXPIRED: "EXPIRED",
    ACTIVE: "ACTIVE",
  };

  /**
   * @description Possible status that we can send in response
   */
  static readonly RESPONSE_STATUSES = {
    SUCCESS: "success",
    ERROR: "error",
    RESTRICTION: "restriction",
    UN_VERIFIED_USER: "unVerifiedUser",
  };

  /**
   * Static registration statuses for the registration process.
   * Represents the different stages a user goes through during registration.
   */
  static readonly REGISTRATION_STATUSES = {
    PENDING: "pending",
    COMPLETED: "completed",
    VERIFICATION_PENDING: "verification_pending",
  };

  /**
   * Static registration statuses for the registration process.
   * Represents the different stages a user goes through during registration.
   */
  static readonly ACTIVE_STATUSES = {
    /**
     * user is active.
     */
    ACTIVE: 10,

    /**
     * User is inactive.
     */
    IN_ACTIVE: 20,
  };

  static readonly USER_ROLES = {
    SUPER_ADMIN: "admin",
    USER: "user",
    MANAGER: "manager",
    STAFF: "staff",
  };

  /**
   * Language Enum
   */
  static readonly LANGUAGES = {
    EN: "en",
    ES: "es",
  };

  /**
   * Transaction Status Enum
   */
  static readonly TRANSACTION_STATUSES = {
    PENDING: "Pending",
    COMPLETED: "Completed",
    FAILED: "Failed",
    DISPUTED: "Disputed",
    CANCELED: "Canceled",
  };

  static readonly SYSTEM_SETTING_KEYS = {
    VERIFICATION_CODE_EXPIRY: "verificationCodeExpiry",
  };

  /**
   * Verification Code Status
   * @description Possible statuses for verification codes
   */
  static readonly VERIFICATION_CODE_STATUS = {
    PENDING: "PENDING",
    VERIFIED: "VERIFIED",
    EXPIRED: "EXPIRED",
    USED: "USED",
  } as const;

  /**
   * Verification Code Type
   * @description Possible types of verification codes
   */
  static readonly VERIFICATION_CODE_TYPE = {
    PASSWORD_RESET: "PASSWORD_RESET",
    REGISTRATION: "REGISTRATION",
  } as const;

  static readonly SESSION_STATUS = {
    ACTIVE: "active",
    EXPIRED: "expired",
    REVOKED: "revoked",
  };

  static readonly ATTACHMENT_PARENT = {
    USER: "users",
    CHANNEL: "channels",
    VIDEO: "video",
  };

  static readonly ATTACHMENT_TYPES = {
    LOGO: "logo",
    THUMBNAIL: "thumbnail",
    PROFILE: "profile",
    OTHER: "other",
  };
}

export type TUserRole =
  (typeof GlobalEnums.USER_ROLES)[keyof typeof GlobalEnums.USER_ROLES];
export type TActiveStatus =
  (typeof GlobalEnums.ACTIVE_STATUSES)[keyof typeof GlobalEnums.ACTIVE_STATUSES];
export type TRegistrationStatus =
  (typeof GlobalEnums.REGISTRATION_STATUSES)[keyof typeof GlobalEnums.REGISTRATION_STATUSES];
export type TVerificationCodeStatus =
  (typeof GlobalEnums.VERIFICATION_CODE_STATUS)[keyof typeof GlobalEnums.VERIFICATION_CODE_STATUS];
export type TVerificationCode =
  (typeof GlobalEnums.VERIFICATION_CODE_TYPE)[keyof typeof GlobalEnums.VERIFICATION_CODE_TYPE];
export type TSessionStatus =
  (typeof GlobalEnums.SESSION_STATUS)[keyof typeof GlobalEnums.SESSION_STATUS];
export type TAttachmentParent =
  (typeof GlobalEnums.ATTACHMENT_PARENT)[keyof typeof GlobalEnums.ATTACHMENT_PARENT];
export type TAttachmentTypes =
  (typeof GlobalEnums.ATTACHMENT_TYPES)[keyof typeof GlobalEnums.ATTACHMENT_TYPES];
