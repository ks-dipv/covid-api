import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TimeSeries } from '../entities/timeseries.entity';

@Injectable()
export class TopRepository extends Repository<TimeSeries> {
  constructor(private dataSource: DataSource) {
    super(TimeSeries, dataSource.createEntityManager());
  }

  async getTopCases(fromDate?: string, toDate?: string, top?: number) {
    const queryBuilder = this.createQueryBuilder('ts');

    if (fromDate) {
      queryBuilder.andWhere('ts.date >= :fromDate', { fromDate });
    }

    if (toDate) {
      queryBuilder.andWhere('ts.date >= :fromDate', { toDate });
    }

    if (top) {
      queryBuilder.limit(top);
    }

    return await queryBuilder
      .select('ts.Name', 'country')
      .addSelect('SUM(ts.confirmed)', 'confirmed')
      .addSelect('SUM(ts.deaths)', 'deaths')
      .addSelect('SUM(ts.recovered)', 'recovered')
      .groupBy('ts.Name')
      .orderBy('SUM(ts.confirmed)', 'DESC')
      .getRawMany();
  }
}
