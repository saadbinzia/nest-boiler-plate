import { forwardRef, Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { MailModule } from "src/modules/mail/mail.module";
import GlobalResponses from "src/core/config/GlobalResponses";
import { HelperService } from "src/core/config/helper.service";
import { AttachmentModule } from "src/modules/shared/attachment/attachment.module";
import { UserVerificationModule } from "src/modules/shared/auth/userVerificationCode/userVerificationCode.module";
import { ForgetPasswordsController } from "src/modules/shared/user/forgetPassword/forgetPasswords.controller";
import { ForgetPasswordService } from "src/modules/shared/user/forgetPassword/forgetPassword.service";
import { UserSessionService } from "../auth/userSession/userSession.service";
import { UsersController } from "./users.controller";
import { SystemSettingService } from "src/core/config/systemSetting.service";

@Module({
  imports: [
    forwardRef(() => MailModule),
    forwardRef(() => UserVerificationModule),
    forwardRef(() => AttachmentModule),
  ],
  controllers: [UsersController, ForgetPasswordsController],
  providers: [
    UserService,
    ForgetPasswordService,
    GlobalResponses,
    HelperService,
    UserSessionService,
    SystemSettingService,
  ],
  exports: [UserService, ForgetPasswordService],
})
export class UserModule {}
