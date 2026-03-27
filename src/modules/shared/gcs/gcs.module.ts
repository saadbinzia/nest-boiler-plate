import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GCSService } from "./gcs.service";
import { CacheModule } from "../cache/cache.module";

@Module({
  imports: [ConfigModule, CacheModule],
  providers: [GCSService],
  exports: [GCSService],
})
export class GCSModule {}
