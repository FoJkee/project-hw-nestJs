import nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  private email = this.configService.get('email');
  private pass = this.configService.get('pass');

  async sendEmail(email: string, subject: string, message: string) {
    const transporter = await nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.email,
        pass: this.pass,
      },
    });
    const info = await transporter.sendMail({
      from: this.email, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: message, // html body
    });
    return info;
  }
}
