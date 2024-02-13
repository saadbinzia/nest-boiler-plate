import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import GlobalResponses from 'src/core/config/GlobalResponses';

@Injectable()
export class MailService
{
	constructor (
		private _mailerService: MailerService,
		private readonly _globalResponses: GlobalResponses
	) { }

	async sendEmail (template, to, bcc, subject, viewData)
	{
		try
		{
			const email = await this._mailerService.sendMail({
				to: to,
				bcc: bcc,
				subject: subject,
				template: `./${template}`,
				context: viewData,
			});

			console.error('email: ', email);
			return email;
		} catch (error)
		{
			console.error(error);
			return this._globalResponses.formatResponse('error', null, null);
		}
	}
}