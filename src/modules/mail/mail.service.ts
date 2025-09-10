import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import * as Handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly emailTemplatesPath: string;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get("EMAIL_HOST"),
      port: this.configService.get("EMAIL_PORT"),
      auth: {
        user: this.configService.get("EMAIL_USER"),
        pass: this.configService.get("EMAIL_PASSWORD"),
      },
    });

    this.emailTemplatesPath = path.join(__dirname, "templates");
    // Ensure templates directory exists
    if (!fs.existsSync(this.emailTemplatesPath)) {
      fs.mkdirSync(this.emailTemplatesPath, { recursive: true });
    }
  }

  private async compileTemplate(
    templateName: string,
    data: any,
  ): Promise<string> {
    const templatePath = path.join(
      this.emailTemplatesPath,
      `${templateName}.hbs`,
    );
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Email template ${templateName} not found`);
    }

    const source = fs.readFileSync(templatePath, "utf8");
    const template = Handlebars.compile(source);
    return template(data);
  }

  async sendEmail(
    to: string,
    subject: string,
    templateName: string,
    templateData: any,
    cc?: string[],
    bcc?: string[],
    attachments?: any[],
  ): Promise<void> {
    try {
      const htmlContent = await this.compileTemplate(
        templateName,
        templateData,
      );

      const mailOptions = {
        from: this.configService.get("EMAIL_FROM") || "noreply@example.com",
        to,
        subject,
        html: htmlContent,
        cc: cc || [],
        bcc: bcc || [],
        attachments: attachments || [],
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
}
