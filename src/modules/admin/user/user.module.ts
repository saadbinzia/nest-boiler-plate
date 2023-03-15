import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './user.service';
import { UserModule as AppUserModule } from 'src/modules/app/user/user.module';

@Module({
  imports: [
    forwardRef(() => AppUserModule),
  ],
  controllers: [UsersController],
  providers: [UserService],
  exports:[UserService]
})
export class UserModule {}