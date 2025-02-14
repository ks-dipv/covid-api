import { BadRequestException, Injectable } from '@nestjs/common';
import { Between, DataSource, Repository } from 'typeorm';
import { TimeSeries } from '../entities/timeseries.entity';
import {
  AddDto,
  DeleteTimeseriesDto,
  UpdateTimeseriesDto,
} from '../dtos/timeseries.dto';

@Injectable()
export class TimeseriesRepository extends Repository<TimeSeries> {
  constructor(private dataSource: DataSource) {
    super(TimeSeries, dataSource.createEntityManager());
  }

  async getCases(
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

    if (confirmedGte || confirmedLte) {
      queryBuilder.andHaving(
        `(SUM(timeseries.confirmed) >= :confirmedGte OR :confirmedGte IS NULL) AND 
         (SUM(timeseries.confirmed) <= :confirmedLte OR :confirmedLte IS NULL)`,
        { confirmedGte, confirmedLte },
      );
    }

    const result = await queryBuilder
      .select('timeseries.Name', 'country')
      .addSelect('SUM(timeseries.confirmed)', 'confirmed')
      .addSelect('SUM(timeseries.deaths)', 'deaths')
      .addSelect('SUM(timeseries.recovered)', 'recovered')
      .groupBy('timeseries.Name')
      .getRawMany();

    return result;
  }

  async entry(data: AddDto) {
    for (let i = 0; i < data.data.length; i++) {
      const existingData = await this.findOne({
        where: { date: data.data[i].date, Name: data.Name },
      });
      if (existingData)
        throw new BadRequestException(
          'Data is already available for given Date and Country',
        );
      const timeData = {
        Name: data.Name,
        date: data.data[i].date,
        confirmed: data.data[i].confirmed,
        deaths: data.data[i].deaths,
        recovered: data.data[i].recovered,
      };
      const newData = await this.create(timeData);
      await this.save(newData);
    }
    return 'Data is added.';
  }

  async deleteData(data: DeleteTimeseriesDto) {
    const fromDate = new Date(data.from).toISOString();
    const toDate = new Date(data.to).toISOString();

    const deleteResult = await this.delete({
      Name: data.name,
      date: Between(fromDate, toDate),
    });

    if (deleteResult.affected === 0) {
      throw new BadRequestException(
        'No data found to delete for the given range.',
      );
    }

    return 'Data is deleted.';
  }

  async updateData(data: UpdateTimeseriesDto) {
    return await this.findOne({
      where: { Name: data.name, date: data.date },
    });
  }
}
