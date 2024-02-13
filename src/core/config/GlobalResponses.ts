/**
 * Dictionary object for storing message strings.
 */
interface MessageDictionary
{
	[key: string]: string;
}

/**
 * Object containing success and error message dictionaries for each language.
 */
interface Messages
{
	[language: string]: {
		success: MessageDictionary;
		error: MessageDictionary;
	};
}

/**
 * Object representing the values to be replaced in message strings.
 */
interface ReplaceValues
{
	[key: string]: string;
}

/**
 * Object representing an API response with status and message.
 */
interface ApiResponse
{
	status: string;
	message: string;
	data: any
}

/**
 * GlobalResponses class to handle formatting API responses with multi-language support.
 */
export default class GlobalResponses
{

	/**
	 * Default status codes for success and error responses.
	 */
	private readonly defaultStatuses: { [key: string]: string; } = {
		success: 'success',
		error: 'error'
	};

	/**
	 * Messages for success and error responses in different languages.
	 */
	private readonly messages: Messages = {
		en: {
			success: {
				default: 'Operation completed successfully.',
				action_success: '{input} {action} successfully.',
				email_sent: 'Email has been sent to the email you provided'
			},
			error: {
				default: 'An error occurred.',
				invalid: 'Invalid {input} provided.',
				not_found: '{input} not found.',
				exists: '{input} already exists.',
				expired: '{input} has been expired.',
				database_error: 'Database error occurred.'
			}
		},
		fr: {
			success: {
				default: `Opération terminée avec succès.`,
				action_success: `{input} {action} avec succès.`,
				email_sent: `Un email a été envoyé à l'adresse que vous avez fournie.`
			},
			error: {
				default: 'Une erreur est survenue.',
				invalid: '{input} fourni invalide.',
				not_found: '{input} non trouvé.',
				exists: '{input} existe déjà.',
				expired: '{input} a expiré.',
				database_error: 'Une erreur de base de données est survenue.'
			}
		}
				// Add more languages as needed
	};

	/**
	 * Formats the API response.
	 * 
	 * @param {string} status - The status of the response ('success' or 'error').
	 * @param {any | null | undefined} data - The data we need to pass in response(optional).
	 * @param {string | null | undefined} messageId - The ID of the message to retrieve (optional).
	 * @param {ReplaceValues} replaceValues - Values to replace in the response message (optional).
	 * @returns {ApiResponse} The formatted API response.
	 */
	formatResponse (status: string, data?: any, messageId?: string | null, replaceValues: ReplaceValues = {}): ApiResponse
	{
		const language: string = 'en'
		if (!(status in this.defaultStatuses))
		{
			status = 'error'; // Default to error status if invalid status provided
		}

		const response: ApiResponse = {
			status: this.defaultStatuses[status],
			data: data ? data : null,
			message: ''
		};

		let message: string | undefined;

		if (messageId)
		{
			message = this.getMessageById(status, messageId, language) || this.getMessage(status, messageId, language);
		} else
		{
			message = this.getMessage(status, 'default', language);
		}

		if (!message)
		{
			message = status === 'success' ? 'Operation completed successfully.' : 'An error occurred.';
		}

		response.message = this.replaceMessageValues(message, replaceValues);

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
	private getMessage (status: string, messageKey: string, language: string): string | undefined
	{
		if (language in this.messages && status in this.messages[language] && messageKey in this.messages[language][status])
		{
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
	private getMessageById (status: string, messageId: string, language: string): string | undefined
	{
		if (language in this.messages && status in this.messages[language])
		{
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
	private replaceMessageValues (message: string, replaceValues: ReplaceValues): string
	{
		for (const key in replaceValues)
		{
			message = message.replace(`{${key}}`, replaceValues[key]);
		}
		return message;
	}
}