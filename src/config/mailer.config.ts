import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { config } from 'dotenv';
import * as process from 'process';
config();

export class MailerConfigService implements MailerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  // private user = this.configService.get('email_from');
  // private pass = this.configService.get('pass_from');

  createMailerOptions(): MailerOptions {
    return {
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        ignoreTLS: true,
        secure: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS,
        },
      },
      defaults: {
        from: '',
      },
      preview: false,
      template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    };
  }
}
