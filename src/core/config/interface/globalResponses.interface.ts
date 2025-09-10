/**
 * Dictionary object for storing message strings.
 */
export interface MessageDictionary {
  [key: string]: string;
}

/**
 * Object containing success and error message dictionaries for each language.
 */
export interface Messages {
  [language: string]: {
    success: MessageDictionary;
    error: MessageDictionary;
  };
}

/**
 * Object representing the values to be replaced in message strings.
 */
export interface ReplaceValues {
  [key: string]: string;
}

/**
 * Object representing an API response with status and message.
 */
export interface ApiResponse {
  statusCode: number;
  status: string;
  message: string;
  data: any;
}
