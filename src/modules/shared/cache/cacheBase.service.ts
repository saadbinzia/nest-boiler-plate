import { Injectable } from "@nestjs/common";
import { InjectRedis } from "@nestjs-modules/ioredis";
import Redis from "ioredis";

@Injectable()
export class CacheBaseService {
  constructor(@InjectRedis() protected readonly redis: Redis) {}

  /**
   * Asynchronously sets a key-value pair in the cache with an optional expiry time.
   *
   * @param {string} key - the key to set in the cache
   * @param {any} value - the value to associate with the key
   * @param {number} [expiry=3600] - the expiry time for the key in seconds
   * @return {Promise<void>} a Promise that resolves when the key-value pair is successfully set in the cache
   */
  async setKey(key: string, value: any, expiry: number = 3600): Promise<void> {
    const valueString = JSON.stringify(value);
    if (expiry) {
      await this.redis.set(key, valueString, "EX", expiry);
    } else {
      await this.redis.set(key, valueString);
    }
  }

  /**
   * Asynchronously retrieves a value from the Redis database using the provided key.
   *
   * @param {string} key - The key used to retrieve the value from the Redis database.
   * @return {Promise<any>} A Promise that resolves with the retrieved value, or null if the key does not exist.
   */
  async getKey(key: string): Promise<any> {
    const value = await this.redis.get(key);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  }

  /**
   * Deletes a key from the redis store.
   *
   * @param {string} key - the key to be deleted
   * @return {Promise<void>} a Promise that resolves when the key is deleted
   */
  async deleteKey(key: string): Promise<void> {
    await this.redis.del(key);
  }

  /**
   * Asynchronously updates the value of a key in the Redis database.
   *
   * @param {string} key - the key to update
   * @param {string} dataKey - the key of the value to update
   * @param {any} dataValue - the new value to associate with the key
   * @param {number} [expiry=3600] - the expiry time for the key in seconds
   * @return {Promise<boolean>} a Promise that resolves with a boolean indicating whether the update was successful
   */
  async update(
    key: string,
    dataKey: string,
    dataValue: any,
    expiry: number = 3600,
  ): Promise<boolean> {
    const data = await this.getKey(key);

    if (!data) {
      return false;
    }

    data[dataKey] = dataValue;
    await this.setKey(key, data, expiry);
    return true;
  }
}
