import { Injectable, NotFoundException } from "@nestjs/common";
import { BaseService } from "../base/base.service";
import { SystemSetting } from "../../entities";
import { AuthenticatedRequest } from "./interface/request.interface";
import { Request } from "express";

@Injectable()
export class SystemSettingService extends BaseService<SystemSetting> {
  constructor() {
    super(SystemSetting);
  }

  /**
   * Get system setting value by key
   * @param {string} key - The setting key to look up
   * @returns {Promise<string>} The setting value as string
   * @throws {NotFoundException} if setting is not found
   */
  async getValueByKey(
    req: Request | AuthenticatedRequest,
    key: string,
  ): Promise<string> {
    const systemSetting = await this.findOne(req, { key });

    if (!systemSetting) {
      throw new NotFoundException(`System setting with key '${key}' not found`);
    }

    return systemSetting.value;
  }

  /**
   * Get system setting value as a number
   * @param {string} key - The setting key to look up
   * @returns {Promise<number>} The setting value as number
   * @throws {Error} if the value cannot be converted to a number
   */
  async getNumberValueByKey(
    req: Request | AuthenticatedRequest,
    key: string,
  ): Promise<number> {
    const value = await this.getValueByKey(req, key);
    const numValue = Number(value);

    if (isNaN(numValue)) {
      throw new Error(`Value for key '${key}' is not a valid number`);
    }

    return numValue;
  }
}
