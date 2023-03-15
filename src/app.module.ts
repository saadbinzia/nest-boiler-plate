import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/providers/database.module';
import { ConfigModule } from '@nestjs/config';
import { ImageModule } from './modules/image/image.module';
import { AdminEndModule } from './modules/admin/adminEnd.module';
import { RouterModule } from 'nest-router';
import { SSRModule } from './modules/ssr/ssr.module';
import { AppEndModule } from './modules/app/appEnd.module';
import { routes } from './routes';

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    ConfigModule.forRoot({ isGlobal: true }),
    forwardRef(() => SSRModule),
    forwardRef(() => AppEndModule),
    forwardRef(() => DatabaseModule),
    forwardRef(() => ImageModule),
    forwardRef(() => AdminEndModule),
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
