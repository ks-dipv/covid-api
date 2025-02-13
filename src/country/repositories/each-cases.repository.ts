import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TimeSeries } from '../entities/timeseries.entity';

@Injectable()
export class EachCasesRepository extends Repository<TimeSeries> {
  constructor(private dataSource: DataSource) {
    super(TimeSeries, dataSource.createEntityManager());
  }

  async eachCase(
    fromDate?: string,
    toDate?: string,
    confirmedGte?: number,
    confirmedLte?: number,
  ) {
    const from = fromDate ? new Date(fromDate) : new Date('2000-01-01');
    const to = toDate ? new Date(toDate) : new Date();

    const result = await this.createQueryBuilder('ts')
      .select('ts.Name', 'country')
      .addSelect('SUM(ts.confirmed)', 'confirmed')
      .addSelect('SUM(ts.deaths)', 'deaths')
      .addSelect('SUM(ts.recovered)', 'recovered')
      .where('ts.date BETWEEN :from AND :to', { from, to })
      .groupBy('ts.Name')
      .having(
        `(SUM(ts.confirmed) >= :confirmedGte OR :confirmedGte IS NULL) AND 
         (SUM(ts.confirmed) <= :confirmedLte OR :confirmedLte IS NULL)`,
        { confirmedGte, confirmedLte },
      )
      .getRawMany();

    return result.map((record) => ({
      country: record.country,
      totals: {
        confirmed: Number(record.confirmed),
        deaths: Number(record.deaths),
        recovered: Number(record.recovered),
      },
    }));
  }
}
