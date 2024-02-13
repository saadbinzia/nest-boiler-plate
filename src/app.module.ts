import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/providers/database.module';
import { ConfigModule } from '@nestjs/config';
import { WebAppModule } from './modules/app/webApp.module';
import { ImageModule } from './modules/image/image.module';
import { routes } from './routes';
import { SSRModule } from './modules/ssr/ssr.module';
import { CronModule } from './modules/cron/cron.module';
import { MailModule } from './modules/mail/mail.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    RouterModule.register(routes),
    ConfigModule.forRoot({ isGlobal: true }),
    forwardRef(() => SSRModule),
    forwardRef(() => WebAppModule),
    forwardRef(() => DatabaseModule),
    forwardRef(() => MailModule),
    forwardRef(() => ImageModule),
    forwardRef(() => CronModule),
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
  exports: [
  ]
})
export class AppModule { }
