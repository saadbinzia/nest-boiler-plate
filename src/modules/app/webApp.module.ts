import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => WebhookModule),
  ],
})
export class WebAppModule { }
