import { forwardRef, Module } from "@nestjs/common";
import GlobalResponses from "src/core/config/GlobalResponses";
import { HelperService } from "src/core/config/helper.service";
import { MailModule } from "src/modules/mail/mail.module";
import { AttachmentModule } from "src/modules/shared/attachment/attachment.module";
import { UserVerificationModule } from "src/modules/shared/auth/userVerificationCode/userVerificationCode.module";
import { AuthModule } from "../auth/auth.module";
import { UserService } from "./user.service";
import { UsersController } from "./users.controller";

@Module({
  imports: [
    forwardRef(() => MailModule),
    forwardRef(() => UserVerificationModule),
    forwardRef(() => AuthModule),
    forwardRef(() => AttachmentModule),
  ],
  controllers: [UsersController],
  providers: [UserService, GlobalResponses, HelperService],
  exports: [UserService],
})
export class UserModule {}
