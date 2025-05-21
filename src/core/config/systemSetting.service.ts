import { Injectable } from "@nestjs/common";
import { BaseService } from "../base/base.service";
import { SystemSetting } from "../../entities";

@Injectable()
export class SystemSettingService extends BaseService {
  constructor() {
    super(SystemSetting);
  }

  async getValueByKey(key: string): Promise<string> {
    const systemSetting = await this.findOne({ key });

    return systemSetting.value;
  }

  async getNumberValueByKey(key: string): Promise<number> {
    const systemSetting = await this.getValueByKey(key);
    return Number(systemSetting);
  }
}
