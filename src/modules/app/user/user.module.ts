import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './user.service';
import { MailModule } from 'src/modules/mail/mail.module';
import GlobalResponses from 'src/core/config/GlobalResponses';

@Module({
  imports: [
    forwardRef(() => MailModule),
  ],
  controllers: [
    UsersController,
  ],
  providers: [
    UserService,
    GlobalResponses
  ],
  exports: [UserService]
})
export class UserModule { }
