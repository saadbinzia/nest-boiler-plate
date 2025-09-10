import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fs from "fs/promises";
import * as fssync from "fs";
import * as path from "path";

interface CacheEntry {
  filePath: string;
  sizeBytes: number;
  lastAccessMs: number;
}

@Injectable()
export class FileCacheService {
  private readonly logger = new Logger(FileCacheService.name);
  private readonly cacheDir: string;
  private readonly maxBytes: number; // e.g., 50GB

  // in-memory index for quick eviction decisions
  private totalBytes = 0;
  private entries = new Map<string, CacheEntry>(); // key: folder/key

  constructor(private readonly configService: ConfigService) {
    const defaultDir = path.join(process.cwd(), "uploads", "cache");
    const defaultMax = 50 * 1024 * 1024 * 1024; // 50 GB

    this.cacheDir =
      this.configService.get<string>("FILE_CACHE_DIR") || defaultDir;
    this.maxBytes = Number(
      this.configService.get<number>("FILE_CACHE_MAX_BYTES") || defaultMax,
    );
  }

  public async initialize(): Promise<void> {
    await fs.mkdir(this.cacheDir, { recursive: true });
    await this.rebuildIndexFromDisk();
    this.logger.log(
      `File cache initialized at ${this.cacheDir} (limit: ${this.human(this.maxBytes)}; current: ${this.human(this.totalBytes)})`,
    );
  }

  // Returns cached buffer if present, otherwise uses supplier, stores to cache, and returns buffer
  public async getOrSetBuffer(
    folder: string,
    key: string,
    supplier: () => Promise<Buffer>,
  ): Promise<Buffer> {
    const cachedPath = await this.getCachedPath(folder, key);
    this.logger.log("cachedPath", cachedPath);
    if (cachedPath) {
      return fs.readFile(cachedPath);
    }

    const data = await supplier();
    await this.store(folder, key, data);
    return data;
  }

  public async getCachedPath(
    folder: string,
    key: string,
  ): Promise<string | null> {
    const relKey = this.relativeKey(folder, key);
    const existing = this.entries.get(relKey);

    if (existing && fssync.existsSync(existing.filePath)) {
      const now = Date.now();
      existing.lastAccessMs = now;
      try {
        await fs.utimes(existing.filePath, now / 1000, now / 1000);
      } catch (err) {
        this.logger.debug(
          `utimes failed for cache entry: ${existing.filePath}: ${String(err)}`,
        );
      }
      return existing.filePath;
    }

    const filePath = path.join(this.cacheDir, folder, key);
    if (fssync.existsSync(filePath)) {
      const stat = await fs.stat(filePath);
      const entry: CacheEntry = {
        filePath,
        sizeBytes: stat.size,
        lastAccessMs: Date.now(),
      };
      this.entries.set(relKey, entry);
      this.totalBytes += stat.size;
      return filePath;
    }

    return null;
  }

  public async store(
    folder: string,
    key: string,
    data: Buffer,
  ): Promise<string> {
    const relKey = this.relativeKey(folder, key);
    const folderPath = path.join(this.cacheDir, folder);
    await fs.mkdir(folderPath, { recursive: true });

    const filePath = path.join(folderPath, key);

    await this.ensureSpace(data.length);

    const tmpPath = `${filePath}.tmp-${process.pid}-${Date.now()}`;
    await fs.writeFile(tmpPath, data);
    await fs.rename(tmpPath, filePath);

    const entry: CacheEntry = {
      filePath,
      sizeBytes: data.length,
      lastAccessMs: Date.now(),
    };

    const previous = this.entries.get(relKey);
    if (previous) {
      this.totalBytes -= previous.sizeBytes;
    }

    this.entries.set(relKey, entry);
    this.totalBytes += data.length;

    return filePath;
  }

  private async ensureSpace(bytesNeeded: number): Promise<void> {
    if (bytesNeeded > this.maxBytes) {
      throw new Error(
        `Single item (${this.human(bytesNeeded)}) exceeds cache capacity (${this.human(this.maxBytes)})`,
      );
    }

    while (this.totalBytes + bytesNeeded > this.maxBytes) {
      const oldest = this.findOldestEntry();
      if (!oldest) break;
      await this.deleteEntry(oldest);
    }
  }

  private findOldestEntry(): [string, CacheEntry] | null {
    let oldest: [string, CacheEntry] | null = null;
    for (const [key, entry] of this.entries) {
      if (!oldest || entry.lastAccessMs < oldest[1].lastAccessMs) {
        oldest = [key, entry];
      }
    }
    return oldest;
  }

  private async deleteEntry(target: [string, CacheEntry]): Promise<void> {
    const [relKey, entry] = target;
    try {
      await fs.unlink(entry.filePath);
    } catch (err) {
      this.logger.debug(
        `Failed to delete cache entry ${entry.filePath}: ${String(err)}`,
      );
    }
    this.entries.delete(relKey);
    this.totalBytes = Math.max(0, this.totalBytes - entry.sizeBytes);
  }

  private async rebuildIndexFromDisk(): Promise<void> {
    this.entries.clear();
    this.totalBytes = 0;

    const walk = async (dir: string) => {
      const items = await fs.readdir(dir, { withFileTypes: true });
      for (const it of items) {
        const full = path.join(dir, it.name);
        if (it.isDirectory()) {
          await walk(full);
        } else if (it.isFile()) {
          const stat = await fs.stat(full);
          const rel = path.relative(this.cacheDir, full);
          const relKey = rel.replace(/\\/g, "/");
          this.entries.set(relKey, {
            filePath: full,
            sizeBytes: stat.size,
            lastAccessMs: stat.mtimeMs || Date.now(),
          });
          this.totalBytes += stat.size;
        }
      }
    };

    if (fssync.existsSync(this.cacheDir)) {
      await walk(this.cacheDir);
    }
  }

  private relativeKey(folder: string, key: string): string {
    return path.join(folder, key).replace(/\\/g, "/");
  }

  private human(bytes: number): string {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let idx = 0;
    let val = bytes;
    while (val >= 1024 && idx < units.length - 1) {
      val = val / 1024;
      idx++;
    }
    return `${val.toFixed(1)} ${units[idx]}`;
  }
}
