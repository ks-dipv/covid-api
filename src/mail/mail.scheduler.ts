import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MailService } from './services/mail.service';

@Injectable()
export class MailScheduler {
  constructor(private readonly mailService: MailService) {}

  @Cron('0 0 * * *')
  async sendDailyEmails() {
    console.log('Sending every minutues subscription emails...');
    await this.mailService.sendDailyUpdateEmail();
  }
}