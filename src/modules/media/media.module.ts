import { Module } from "@nestjs/common";
import { MediasController } from "./medias.controller";
import GlobalResponses from "src/core/config/GlobalResponses";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ClassSerializerInterceptor } from "@nestjs/common";
import { AttachmentModule } from "../shared/attachment/attachment.module";

@Module({
  imports: [AttachmentModule],
  controllers: [MediasController],
  providers: [
    GlobalResponses,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  exports: [],
})
export class MediaModule {}
