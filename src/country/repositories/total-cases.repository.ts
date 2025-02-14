import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TimeSeries } from '../entities/timeseries.entity';
import { CountryRepository } from './country.repository';

@Injectable()
export class TotalCasesRepository extends Repository<TimeSeries> {
  constructor(
    private dataSource: DataSource,
    private readonly countryRepository: CountryRepository,
  ) {
    super(TimeSeries, dataSource.createEntityManager());
  }

  async getCases(fromDate?: string, toDate?: string, code?: string) {
    const from = fromDate ? new Date(fromDate) : new Date('2000-01-01');
    const to = toDate ? new Date(toDate) : new Date();

    if (code) {
      const country = await this.countryRepository.findOne({
        where: { code: code.toUpperCase() },
      });

      const countryName = (await country).Name;

      return await this.createQueryBuilder('timeseries')
        .select('SUM(timeseries.confirmed)', 'confirmed')
        .addSelect('SUM(timeseries.deaths)', 'deaths')
        .addSelect('SUM(timeseries.recovered)', 'recovered')
        .where('timeseries.Name = :countryName', { countryName })
        .andWhere('timeseries.date BETWEEN :from AND :to', { from, to })
        .getRawOne();
    }

    return await this.createQueryBuilder('timeseries')
      .select('SUM(timeseries.confirmed)', 'confirmed')
      .addSelect('SUM(timeseries.deaths)', 'deaths')
      .addSelect('SUM(timeseries.recovered)', 'recovered')
      .where('timeseries.date BETWEEN :from AND :to', { from, to })
      .getRawOne();
  }
}
