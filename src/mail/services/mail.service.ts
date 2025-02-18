import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  public async sendUserWelcome(user: User): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      from: `Onboarding Team <support@nestjs-blog.com>`,
      subject: 'Welcome to Nestjs Blog',
      template: './data',
      context: {
        name: user.firstName,
        email: user.email,
        loginUrl: 'http://localhost:3000',
      },
    });
  }
}
