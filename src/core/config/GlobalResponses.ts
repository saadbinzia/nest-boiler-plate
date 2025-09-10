import { Request } from "express";
import {
  ApiResponse,
  Messages,
  ReplaceValues,
} from "./interface/globalResponses.interface";
import { AuthenticatedRequest } from "./interface/request.interface";
import englishTranslations from "./translations/english";
import spanishTranslations from "./translations/spanish";
import { GlobalEnums } from "./globalEnums";
import { HttpStatus } from "@nestjs/common";

const { RESPONSE_STATUSES } = GlobalEnums;
/**
 * GlobalResponses class to handle formatting API responses with multi-language support.
 */
export default class GlobalResponses {
  /**
   * Default status codes for success and error responses.
   */
  private readonly defaultStatuses: { [key: string]: string } = {
    success: "success",
    error: "error",
    restriction: "restriction",
    unVerifiedUser: "unVerifiedUser",
  };

  /**
   * Messages for success and error responses in different LANGUAGES.
   */
  private readonly messages: Messages = {
    en: englishTranslations,
    es: spanishTranslations,
    // Add more LANGUAGES as needed
  };

  /**
   * Formats the API response.
   * @param {Request | AuthenticatedRequest} request - The req object.
   * @param {string} status - The status of the response ('success' or 'error').
   * @param {any | null | undefined} data - The data we need to pass in response(optional).
   * @param {string | null | undefined} messageId - The ID of the message to retrieve (optional).
   * @returns {ApiResponse} The formatted API response.
   */
  formatResponse(
    request: Request | AuthenticatedRequest,
    status: string,
    data?: any,
    messageId?: string | null,
  ): ApiResponse {
    // Extract language from headers
    const language = (request?.headers?.language as string) || "en";

    if (!(status in this.defaultStatuses)) {
      status = "error"; // Default to error status if invalid status provided
    }

    if (data && status !== RESPONSE_STATUSES.SUCCESS) {
      console.log("Error => ", data);
    }

    let statusCode = HttpStatus.OK;
    if (status === RESPONSE_STATUSES.UN_VERIFIED_USER) {
      statusCode = HttpStatus.FORBIDDEN;
    }
    if (status === RESPONSE_STATUSES.ERROR && data) {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      // Handle specific error cases

      if (data.name) {
        if (data?.name === "ConflictError") {
          statusCode = HttpStatus.CONFLICT;
        } else if (data?.name === "ValidationError") {
          statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
        } else if (data?.name === "NotFoundError") {
          statusCode = HttpStatus.NOT_FOUND;
        } else if (data?.name === "BadRequestError") {
          statusCode = HttpStatus.BAD_REQUEST;
        } else if (data?.name === "UnavailableError") {
          statusCode = HttpStatus.SERVICE_UNAVAILABLE;
        } else {
          statusCode = data?.status;
        }
      }

      messageId = data?.message;
    }

    // console.log(status);

    const response: ApiResponse = {
      statusCode,
      status,
      data: data ? data : null,
      message: "",
    };

    if (messageId) {
      response.message =
        this.getMessageById(status, messageId, language) ||
        this.getMessage(status, messageId, language);
    } else {
      response.message = this.getMessage(status, "default", language);
    }

    if (!response.message) {
      response.message =
        status === RESPONSE_STATUSES.SUCCESS
          ? "Operation completed successfully."
          : "Oops! Something went wrong. Please try again later.";
    }

    return response;
  }

  /**
   * Retrieves a message based on status and message key.
   *
   * @param {string} status - The status of the response ('success' or 'error').
   * @param {string} messageKey - The key of the message to retrieve.
   * @param {string} language - The language for the response message.
   * @returns {string | undefined} The message corresponding to the provided status and key.
   */
  private getMessage(
    status: string,
    messageKey: string,
    language: string,
  ): string | undefined {
    if (
      language in this.messages &&
      status in this.messages[language] &&
      messageKey in this.messages[language][status]
    ) {
      return this.messages[language][status][messageKey];
    }
    return;
  }

  /**
   * Retrieves a message by ID.
   *
   * @param {string} status - The status of the response ('success' or 'error').
   * @param {string} messageId - The ID of the message to retrieve.
   * @param {string} language - The language for the response message.
   * @returns {string | undefined} The message corresponding to the provided ID.
   */
  private getMessageById(
    status: string,
    messageId: string,
    language: string,
  ): string | undefined {
    if (language in this.messages && status in this.messages[language]) {
      const messageKeys = Object.keys(this.messages[language][status]);
      const index = parseInt(messageId) % messageKeys.length;
      return this.messages[language][status][messageKeys[index]];
    }
    return;
  }

  /**
   * Replaces placeholders in the message with provided values.
   *
   * @param {string} message - The message string.
   * @param {ReplaceValues} replaceValues - Values to replace in the message.
   * @returns {string} The message with replaced values.
   */
  private replaceMessageValues(
    message: string,
    replaceValues: ReplaceValues,
  ): string {
    for (const key in replaceValues) {
      message = message.replaceAll(`{${key}}`, replaceValues[key]);
    }
    return message;
  }
}
