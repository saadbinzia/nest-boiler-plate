import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response, Request } from "express";
import GlobalResponses from "../config/GlobalResponses";
import { GlobalEnums } from "../config/globalEnums";

const { RESPONSE_STATUSES } = GlobalEnums;

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  _globalResponses = new GlobalResponses();
  constructor() {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    if (exception.status === 413) {
      exception = new Error("file_size_exceeds");
      exception.name = "BadRequestError";
    }
    delete exception?.storageErrors;
    const errorResponse = this._globalResponses.formatResponse(
      request,
      RESPONSE_STATUSES.ERROR,
      exception,
      "default",
    );
    return response.status(errorResponse.statusCode).json(errorResponse);
  }
}
