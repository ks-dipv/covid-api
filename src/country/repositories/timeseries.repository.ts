import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TimeSeries } from '../entities/timeseries.entity';

@Injectable()
export class TimeseriesRepository extends Repository<TimeSeries> {
  constructor(private dataSource: DataSource) {
    super(TimeSeries, dataSource.createEntityManager());
  }
}
