import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HelperService } from "src/core/config/helper.service";
import * as path from "path";
import { promises as fs } from "fs";

@Injectable()
export class LocalStorageService {
  private readonly uploadsRoot: string;

  constructor(
    private readonly helperService: HelperService,
    private readonly configService: ConfigService,
  ) {
    this.uploadsRoot = path.join(process.cwd(), "uploads");
  }

  private publicBaseUrl(): string {
    const base =
      this.configService.get<string>("API_URL") ||
      this.configService.get<string>("APP_URL") ||
      "";
    return base.replace(/\/$/, "");
  }

  private toWebPath(folder: string, key: string): string {
    const f = folder.split(/[/\\]/).filter(Boolean).join("/");
    const k = key.split(/[/\\]/).filter(Boolean).join("/");
    return `${f}/${k}`;
  }

  async uploadFile(
    key: string,
    buffer: Buffer,
    _contentType: string,
    folder: string = "videos",
  ): Promise<string> {
    const dir = path.join(
      this.uploadsRoot,
      ...folder.split(/[/\\]/).filter(Boolean),
    );
    await this.helperService.createDirectory(dir);
    const filePath = path.join(dir, key);
    await fs.writeFile(filePath, buffer);

    const webPath = this.toWebPath(folder, key);
    const base = this.publicBaseUrl();
    return base ? `${base}/uploads/${webPath}` : `/uploads/${webPath}`;
  }

  async deleteFile(objectKey: string): Promise<void> {
    const filePath = path.join(
      this.uploadsRoot,
      ...objectKey.split("/").filter(Boolean),
    );
    try {
      await fs.unlink(filePath);
    } catch (e: unknown) {
      const err = e as { code?: string };
      if (err.code !== "ENOENT") {
        throw e;
      }
    }
  }

  async downloadBuffer(objectPath: string): Promise<Buffer> {
    const filePath = path.join(
      this.uploadsRoot,
      ...objectPath.split("/").filter(Boolean),
    );
    return fs.readFile(filePath);
  }
}
