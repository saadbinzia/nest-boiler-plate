import { RedisModule } from "@nestjs-modules/ioredis";
import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as dotenv from "dotenv";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SystemSettingService } from "./core/config/systemSetting.service";
import { DatabaseModule } from "./core/providers/database.module";
import { AdminModule } from "./modules/admin/admin.module";
import { WebAppModule } from "./modules/app/webApp.module";
import { CronModule } from "./modules/cron/cron.module";
import { ImageModule } from "./modules/image/image.module";
import { MailModule } from "./modules/mail/mail.module";
import { CacheModule } from "./modules/shared/cache/cache.module";
import { SharedModule } from "./modules/shared/shared.module";

/**
 * Loads environment variables from a .env file into the application's environment.
 *
 * It's typically called at the entry point of the application, such as in the `app.module.ts` file,
 * to ensure that environment variables are available throughout the application.
 *
 */
dotenv.config();

@Module({
  imports: [
    RedisModule.forRoot({
      type: "single",
      url: process.env.REDIS_URL,
      // Un-comment following code if password is required also set the password in you .env file
      // options: {
      //   password: process.env.REDIS_PASSWORD
      // }
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule,
    forwardRef(() => AdminModule),
    forwardRef(() => WebAppModule),
    forwardRef(() => SharedModule),
    forwardRef(() => DatabaseModule),
    forwardRef(() => MailModule),
    forwardRef(() => ImageModule),
    forwardRef(() => CronModule),
  ],
  controllers: [AppController],
  providers: [AppService, SystemSettingService],
  exports: [SystemSettingService],
})
export class AppModule {}
