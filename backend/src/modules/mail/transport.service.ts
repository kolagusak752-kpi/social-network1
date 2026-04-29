import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class TransportService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  async sendCode(to: string, code: string) {
    try {
      await this.transporter.sendMail({
        from: `"Messenger" <${process.env.SMTP_USER}>`,
        to: to,
        subject: 'Підтвердження реєстрації',
        html: `<h2>Дякуємо за реєстрацію на нашому сайті!</h2>
            <p>Ваш код підтвердження: <div>${code}</div></p>`,
      });
      console.log('Код відправлено');
    } catch (error: any) {
      console.log(
        `Помилка відправки коду на пошту ${to}, помилка: ${error.message}`,
      );
    }
  }
  async sendMail(to: string, content?: string) {
    try {
      await this.transporter.sendMail({
        from: `"Messenger" <${process.env.SMTP_USER}>`,
        to: to,
        subject: 'Сповіщення',
        html: `<p>${content}</p>`,
      });
      console.log('Сповіщення відправлено');
    } catch (error: any) {
      console.log(
        `Помилка відправки сповіщення на пошту ${to}, помилка: ${error.message}`,
      );
    }
  }
}
