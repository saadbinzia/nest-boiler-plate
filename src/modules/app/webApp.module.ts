import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { WebhookModule } from "./webhook/webhook.module";

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => WebhookModule),
    forwardRef(() => AuthModule),
  ],
})
export class WebAppModule {}
