import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Resend } from "resend";
import * as fs from "fs";
import * as path from "path";
import * as Handlebars from "handlebars";

@Injectable()
export class MailService {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>("MAIL_PASSWORD"));
  }

  async sendEmail(
    templateName: string,
    to: string,
    subject: string,
    viewData: any,
  ) {
    try {
      // Load and compile Handlebars template
      const templatePath = path.join(
        __dirname,
        "templates",
        `${templateName}.hbs`,
      );
      const templateSource = fs.readFileSync(templatePath, "utf8");
      const template = Handlebars.compile(templateSource);
      const html = template(viewData);

      const { data, error } = await this.resend.emails.send({
        from: this.configService.get<string>("MAIL_FROM"),
        to: [to],
        subject,
        html,
      });

      if (error) {
        console.error("Email send error:", error);
        return { success: false, error };
      }

      console.log("Email sent:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Error sending email:", error);
      return { success: false, error: error.message };
    }
  }
}
