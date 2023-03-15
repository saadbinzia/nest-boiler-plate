import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private _mailerService: MailerService) { }

  /**
   * Send email using nest mailer service 
   * @param template string
   * @param to string
   * @param bcc string
   * @param subject string
   * @param viewData object
   * @returns object
   */
  async sendEmail(template: string, to: string, bcc: string, subject: string, viewData: any) {
    try {
      let email = await this._mailerService.sendMail({
        to: to,
        bcc: bcc,
        subject: subject,
        template: `./${template}`,
        context: viewData,
      });

      console.error('email: ', email);
      return email
    } catch (error) {
      console.error(error);
      return { status: 'error', message: 'Something went wrong'}      
    }
  }
}