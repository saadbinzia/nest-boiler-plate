import { Injectable } from '@nestjs/common';

/**
 * GlobalEnums
 * 
 * @description need to put all global enums - things that we are going to use through out the app like user session response
 */
@Injectable()
export class GlobalEnums
{
	/**
	 * @description Statuses for user tokens in user sessions table.
	 */
	static readonly userSessionStatus = {
		EXPIRED: 'EXPIRED',
		ACTIVE: 'ACTIVE'
	};
}