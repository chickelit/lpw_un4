import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export class Nodemailer {
  public static readonly transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT!,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  public static send(options: Mail) {
    return new Promise((resolve, reject) => {
      const mail = this.transport.sendMail(options, (err) => reject(err));

      resolve(mail);
    });
  }
}
