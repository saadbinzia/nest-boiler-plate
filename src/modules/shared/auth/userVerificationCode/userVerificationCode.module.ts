import { Module, forwardRef } from "@nestjs/common";
import { UserVerificationCodeService } from "./userVerificationCode.service";
import { UserVerificationCodesController } from "./userVerificationCodes.controller";
import { MailModule } from "src/modules/mail/mail.module";
import GlobalResponses from "src/core/config/GlobalResponses";
import { HelperService } from "src/core/config/helper.service";
import { UserService } from "../../user/user.service";
import { AttachmentModule } from "../../attachment/attachment.module";
import { SystemSettingService } from "src/core/config/systemSetting.service";

@Module({
  imports: [forwardRef(() => MailModule), forwardRef(() => AttachmentModule)],
  controllers: [UserVerificationCodesController],
  providers: [
    UserVerificationCodeService,
    GlobalResponses,
    HelperService,
    UserService,
    SystemSettingService,
  ],
  exports: [UserVerificationCodeService],
})
export class UserVerificationModule {}
