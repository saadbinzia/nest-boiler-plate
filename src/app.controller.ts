import { Controller, Get, Res } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";

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

  @Get("favicon.png")
  @ApiOperation({ summary: "Handle favicon request" })
  @ApiResponse({ status: 204, description: "No content - favicon not found" })
  getFavicon(@Res() res: Response): void {
    // Return 204 No Content for favicon requests
    res.status(204).end();
  }

  @Get("robots.txt")
  @ApiOperation({ summary: "Handle robots.txt request" })
  @ApiResponse({ status: 200, description: "Returns robots.txt content" })
  getRobots(@Res() res: Response): void {
    // Return robots.txt content
    const robotsContent = `User-agent: *
Disallow: /`;
    res.setHeader("Content-Type", "text/plain");
    res.send(robotsContent);
  }

  @Get("health")
  @ApiOperation({ summary: "Health check endpoint" })
  @ApiResponse({ status: 200, description: "Returns health status" })
  getHealth(): { status: string; timestamp: string } {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }
}
