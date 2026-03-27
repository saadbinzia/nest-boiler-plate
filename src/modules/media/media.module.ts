import { Module } from "@nestjs/common";
import { MediasController } from "./medias.controller";
import GlobalResponses from "src/core/config/GlobalResponses";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ClassSerializerInterceptor } from "@nestjs/common";
import { GCSService } from "../shared/gcs/gcs.service";
import { FileCacheService } from "../shared/cache/fileCache.service";

@Module({
  controllers: [MediasController],
  providers: [
    GlobalResponses,
    GCSService,
    FileCacheService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  exports: [],
})
export class MediaModule {}
