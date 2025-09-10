import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";

/**
 * Decorator to document common error responses for API endpoints
 */
export function ApiErrorResponse() {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: "Internal server error",
      schema: {
        example: {
          statusCode: 500,
          message: "An error occurred while processing your request",
          error: "Internal Server Error",
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: "Unauthorized",
      schema: {
        example: {
          statusCode: 401,
          message: "Unauthorized",
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: "Forbidden",
      schema: {
        example: {
          statusCode: 403,
          message: "Forbidden resource",
          error: "Forbidden",
        },
      },
    }),
  );
}
