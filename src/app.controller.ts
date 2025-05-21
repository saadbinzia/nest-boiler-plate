import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Greetings")
@Controller()
export class AppController {
  constructor(private readonly _appService: AppService) {}

  @Get()
  @ApiOperation({ summary: "Retrieve greeting message" })
  @ApiResponse({ status: 200, description: "Returns the greeting message" })
  @ApiResponse({ status: 500, description: "Internal server error" })
  getHello(): string {
    return this._appService.getHello();
  }
}
