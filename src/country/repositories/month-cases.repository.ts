import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TimeSeries } from '../entities/timeseries.entity';

@Injectable()
export class MonthCaseRepository extends Repository<TimeSeries> {
  constructor(private dataSource: DataSource) {
    super(TimeSeries, dataSource.createEntityManager());
  }

  async getMonthCase(
    fromDate?: string,
    toDate?: string,
    confirmedGte?: number,
    confirmedLte?: number,
  ) {
    const queryBuilder = this.createQueryBuilder('timeseries');

    if (fromDate) {
      queryBuilder.andWhere('timeseries.date >= :fromDate', { fromDate });
    }

    if (toDate) {
      queryBuilder.andWhere('timeseries.date >= :fromDate', { toDate });
    }

    return await queryBuilder
      .select('timeseries.Name', 'country')
      .addSelect("TO_CHAR(CAST(timeseries.date AS DATE), 'YYYY-MM')", 'month')
      .addSelect('SUM(timeseries.confirmed)', 'confirmed')
      .addSelect('SUM(timeseries.deaths)', 'deaths')
      .addSelect('SUM(timeseries.recovered)', 'recovered')
      .groupBy('timeseries.Name')
      .addGroupBy("TO_CHAR(CAST(timeseries.date AS DATE), 'YYYY-MM')")
      .having(
        `(SUM(timeseries.confirmed) >= :confirmedGte OR :confirmedGte IS NULL) AND 
       (SUM(timeseries.confirmed) <= :confirmedLte OR :confirmedLte IS NULL)`,
        { confirmedGte, confirmedLte },
      )
      .orderBy('country', 'ASC')
      .addOrderBy('month', 'ASC')
      .getRawMany();
  }
}
