import { Module, Global } from "@nestjs/common";
import { CacheService } from "./cache.service";
import { CacheBaseService } from "./cacheBase.service";
import { FileCacheService } from "./fileCache.service";
import { ConfigModule } from "@nestjs/config";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [CacheBaseService, CacheService, FileCacheService],
  exports: [CacheService, FileCacheService],
})
export class CacheModule {}
