import { ApiProperty } from "@nestjs/swagger";

export class SuccessResponse {
  @ApiProperty({ example: "200" })
  statusCode: number;

  @ApiProperty({ example: "success" })
  status: string;

  @ApiProperty({ example: null })
  data: { [key: string]: any };

  @ApiProperty({ example: ["Array of messages"] })
  message: Array<string>;
}
export class ErrorResponse {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: "error" })
  status: string;

  @ApiProperty({ example: ["Array of messages"] })
  message: Array<string>;
}

export class unAuthorizedResponse {
  @ApiProperty({ example: 401 })
  statusCode: number;

  @ApiProperty({ example: "Unauthorized" })
  message: string;
}

export class UnprocessableResponse {
  @ApiProperty({ example: 422 })
  statusCode: number;

  @ApiProperty({ example: "Unprocessable Entity" })
  error: string;

  @ApiProperty({ example: ["Array of messages"] })
  message: Array<string>;
}

export class ForbiddenResponse {
  @ApiProperty({ example: 403 })
  statusCode: number;

  @ApiProperty({ example: "Access denied: Insufficient permissions" })
  message: string;
}
