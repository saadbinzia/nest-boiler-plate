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
    STARTED: "STARTED",
    UNVERIFIED: "UNVERIFIED",
    COMPLETED: "COMPLETED",
  };

  /**
   * Static registration statuses for the registration process.
   * Represents the different stages a user goes through during registration.
   */
  static readonly ACTIVE_STATUSES = {
    /**
     * user is active.
     */
    ACTIVE: "ACTIVE",

    /**
     * User is inactive.
     */
    IN_ACTIVE: "IN_ACTIVE",
  };

  static readonly USER_ROLES = {
    ADMIN: "ADMIN",
    USER: "USER",
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
    ACTIVE: "ACTIVE",
    EXPIRED: "EXPIRED",
    REVOKED: "REVOKED",
  };

  static readonly ATTACHMENT_PARENT = {
    USER: "USERS",
    TRIBUTE: "TRIBUTES",
  };

  static readonly ATTACHMENT_TYPES = {
    MOMENTS_IN_TIME: "MOMENTS_IN_TIME",
    LIVING_MEMORIES: "LIVING_MEMORIES",
    PROFILE: "PROFILE",
    OTHER: "other",
  };

  /**
   * Property related enums
   */
  static readonly PROPERTY_TYPES = {
    COMMERCIAL: "commercial",
    RESTAURANT: "restaurant",
    ENTERTAINMENT: "entertainment",
    OFFICE: "office",
    PARKING: "parking",
    HOSPITAL: "hospital",
  } as const;

  static readonly SPACE_TYPES = {
    OFFICE: "office",
    RESTAURANT: "restaurant",
    KARAOKE: "karaoke",
    PARKING: "parking",
    HOSPITAL: "hospital",
    OTHER: "other",
  } as const;

  static readonly SPACE_CONDITION = {
    NEW: "new",
    GOOD: "good",
    NEEDS_RENOVATION: "needs_renovation",
    UNDER_RENOVATION: "under_renovation",
  } as const;

  static readonly OCCUPANCY_STATUS = {
    OCCUPIED: "occupied",
    VACANT: "vacant",
    RESERVED: "reserved",
  } as const;

  static readonly EXPENSE_CATEGORIES = {
    MAINTENANCE: "maintenance",
    UTILITIES: "utilities",
    TAXES: "taxes",
    OTHER: "other",
  } as const;
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
