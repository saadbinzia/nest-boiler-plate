import { forwardRef, Module } from "@nestjs/common";
import GlobalResponses from "src/core/config/GlobalResponses";
import { HelperService } from "src/core/config/helper.service";
import { SystemSettingService } from "src/core/config/systemSetting.service";
import { AuthModule } from "./auth/auth.module";
import { SharedAuthService } from "./auth/auth.service";
import { UserSessionService } from "./auth/userSession/userSession.service";
import { CacheModule } from "./cache/cache.module";
import { NotificationModule } from "./notification/notification.module";
import { UserModule } from "./user/user.module";
import { GCSModule } from "./gcs/gcs.module";
import { AttachmentModule } from "./attachment/attachment.module";
import { S3Module } from "./s3/s3.module";

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => CacheModule),
    forwardRef(() => AuthModule),
    forwardRef(() => NotificationModule),
    forwardRef(() => AttachmentModule),
    forwardRef(() => S3Module),
    forwardRef(() => GCSModule),
  ],
  providers: [
    SharedAuthService,
    UserSessionService,
    GlobalResponses,
    HelperService,
    SystemSettingService,
  ],
  exports: [
    SharedAuthService,
    UserSessionService,
    SystemSettingService,
    GlobalResponses,
    HelperService,
    AttachmentModule,
    S3Module,
    GCSModule,
  ],
})
export class SharedModule {}
