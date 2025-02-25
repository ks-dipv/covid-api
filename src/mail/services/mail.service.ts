import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeSeries } from '../../country/entities/timeseries.entity';
import { Country } from '../../country/entities/country.entity';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(TimeSeries)
    private timeSeriesRepository: Repository<TimeSeries>,
    @InjectRepository(Country) private countryRepository: Repository<Country>,
  ) {}

  public async sendDailyUpdateEmail() {
    const users = await this.userRepository.find({
      where: {
        subscription: Not(IsNull()),
      },
    });

    for (const user of users) {
      const countryData = [];
      for (const countryName of user.subscription) {
        const country = await this.countryRepository.findOne({
          where: { Name: countryName },
        });

        if (!country) {
          continue;
        }

        const totalData = await this.timeSeriesRepository
          .createQueryBuilder('timeseries')
          .select('SUM(timeseries.confirmed)', 'confirmed')
          .addSelect('SUM(timeseries.deaths)', 'deaths')
          .addSelect('SUM(timeseries.recovered)', 'recovered')
          .where('timeseries.country = :countryId', { countryId: country.id })
          .getRawOne();

        const latestData = await this.timeSeriesRepository.findOne({
          where: { country: country },
          order: { date: 'DESC' },
        });

        countryData.push({ countryName: country.Name, totalData, latestData });
      }

      await this.mailerService.sendMail({
        to: user.email,
        from: 'COVID-19 Updates <support@covid-updates.com>',
        subject: 'Daily COVID-19 Update',
        template: './data',
        context: {
          name: user.firstName,
          countryData: countryData,
        },
      });
    }
  }
}
