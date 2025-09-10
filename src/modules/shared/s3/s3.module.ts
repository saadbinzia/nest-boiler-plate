import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { S3Service } from "./s3.service";
import { CacheModule } from "../cache/cache.module";

@Module({
  imports: [ConfigModule, CacheModule],
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}
