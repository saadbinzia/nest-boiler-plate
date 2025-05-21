import { Attachment } from "./attachment.entity";
import { Notification } from "./notification.entity";
import { SocialLogin } from "./socialLogin.entity";
import { SystemSetting } from "./systemSetting.entity";
import { User } from "./user.entity";
import { UserSession } from "./userSession.entity";
import { UserVerificationCode } from "./userVerificationCode.entity";

const entities = [
  Attachment,
  SocialLogin,
  User,
  UserSession,
  UserVerificationCode,
  SystemSetting,
  Notification,
];

export {
  Attachment, Notification, SocialLogin, SystemSetting, User,
  UserSession,
  UserVerificationCode
};
export default entities;
