import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(email: string, subject: string, message: string) {
    await this.mailerService.sendMail({
      // from: email, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: message, // html body
    });
    return;
  }

  // async sendEmail(email: string, login: string, confirmationCode: string) {
  //   const conformUrl = `https://somesite.com/confirm-email?code=${confirmationCode}"`;
  //   await this.mailerService.sendMail({
  //     // from: email, // sender address
  //     to: email, // list of receivers
  //     subject: 'Registration', // Subject line
  //     template: './registration',
  //     context: {
  //       name: login,
  //       conformUrl,
  //     },
  //   });
  //   return;
  // }
}
