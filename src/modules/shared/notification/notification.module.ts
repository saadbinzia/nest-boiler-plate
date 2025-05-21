import { forwardRef, Module } from "@nestjs/common";
import GlobalResponses from "src/core/config/GlobalResponses";
import { HelperService } from "src/core/config/helper.service";
import { AuthModule } from "../auth/auth.module";
import { NotificationsController } from "./notifications.controller";
import { NotificationService } from "./notification.service";

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [NotificationsController],
  providers: [NotificationService, GlobalResponses, HelperService],
  exports: [NotificationService],
})
export class NotificationModule {}
