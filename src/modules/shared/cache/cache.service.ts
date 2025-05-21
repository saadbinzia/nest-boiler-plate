import { InjectRedis } from "@nestjs-modules/ioredis";
import { Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { CacheBaseService } from "./cacheBase.service";
import { ISessionCache } from "./cache.interface";

@Injectable()
export class CacheService extends CacheBaseService {
  private readonly KEYS = {
    session: "session",
  };

  constructor(@InjectRedis() protected readonly redis: Redis) {
    super(redis);
  }

  /**
   * A function to set session data in the cache.
   *
   * @param {string} keyId - the key identifier for the session
   * @param {ISessionCache} data - the session data to be stored
   * @return {Promise<any>} a Promise that resolves after setting the session data in the cache
   */
  public async setSession(keyId: string, data: ISessionCache): Promise<any> {
    // Map the required attributes only
    const attributes = {
      id: data.id,
      authToken: data.authToken,
      status: data.status,
      userId: data.userId,
      rememberMe: data.rememberMe,
      lastSyncTime: Number(Date.now()),
    };

    await this.setKey(`${this.KEYS.session}:${keyId}`, attributes);
  }

  /**
   * Get a session by key ID.
   *
   * @param {string} keyId - the ID of the key
   * @return {Promise<any>} the session corresponding to the key ID
   */
  public async getSession(keyId: string): Promise<any> {
    return this.getKey(`${this.KEYS.session}:${keyId}`);
  }

  /**
   * Delete a session by keyId.
   *
   * @param {string} keyId - The keyId of the session to be deleted
   * @return {Promise<any>} Returns a promise with the result of the deletion
   */
  public async deleteSession(keyId: string): Promise<any> {
    return this.deleteKey(`${this.KEYS.session}:${keyId}`);
  }
}
