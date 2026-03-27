import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HelperService } from "src/core/config/helper.service";
import { FileCacheService } from "../cache/fileCache.service";
import { GCSService } from "../gcs/gcs.service";
import { S3Service } from "../s3/s3.service";
import { LocalStorageService } from "./local-storage.service";

export const ATTACHMENT_STORAGE = Symbol("ATTACHMENT_STORAGE");

export const attachmentStorageProvider: Provider = {
  provide: ATTACHMENT_STORAGE,
  useFactory: (
    configService: ConfigService,
    fileCacheService: FileCacheService,
    helperService: HelperService,
  ): S3Service | GCSService | LocalStorageService => {
    const raw =
      process.env.STORAGE_TYPE ??
      configService.get<string>("STORAGE_TYPE") ??
      "s3";
    const type = String(raw).toLowerCase().trim();
    if (type === "gcs") {
      return new GCSService(configService, fileCacheService);
    }
    if (type === "local") {
      return new LocalStorageService(helperService, configService);
    }
    return new S3Service(configService, fileCacheService);
  },
  inject: [ConfigService, FileCacheService, HelperService],
};
