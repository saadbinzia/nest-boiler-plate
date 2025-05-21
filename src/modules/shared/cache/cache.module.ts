import { Module, Global } from "@nestjs/common";
import { CacheService } from "./cache.service";
import { CacheBaseService } from "./cacheBase.service";

@Global()
@Module({
  providers: [CacheBaseService, CacheService],
  exports: [CacheService],
})
export class CacheModule {}
