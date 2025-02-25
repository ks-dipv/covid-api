import {
  BadRequestException,
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { Between, DataSource, Repository } from 'typeorm';
import { TimeSeries } from '../entities/timeseries.entity';
import { Country } from '../entities/country.entity';
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
    const queryBuilder = this.createQueryBuilder(
      'timeseries',
    ).leftJoinAndSelect('timeseries.country', 'country');

    if (fromDate) {
      queryBuilder.andWhere('timeseries.date >= :fromDate', { fromDate });
    }

    if (toDate) {
      queryBuilder.andWhere('timeseries.date <= :toDate', { toDate });
    }

    if (confirmedGte || confirmedLte) {
      queryBuilder.andHaving(
        `(SUM(timeseries.confirmed) >= :confirmedGte OR :confirmedGte IS NULL) AND 
         (SUM(timeseries.confirmed) <= :confirmedLte OR :confirmedLte IS NULL)`,
        { confirmedGte, confirmedLte },
      );
    }

    const result = await queryBuilder
      .select('country.Name', 'country')
      .addSelect('SUM(timeseries.confirmed)', 'confirmed')
      .addSelect('SUM(timeseries.deaths)', 'deaths')
      .addSelect('SUM(timeseries.recovered)', 'recovered')
      .groupBy('country.Name')
      .getRawMany();

    return result;
  }

  async entry(data: AddDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      // Connect Query Runner to datasource
      await queryRunner.connect();

      // Start Transaction
      await queryRunner.startTransaction();
    } catch (error) {
      throw new RequestTimeoutException(
        'Could not connect to the database',
        error,
      );
    }

    try {
      for (let i = 0; i < data.data.length; i++) {
        const country = await queryRunner.manager.findOne(Country, {
          where: { Name: data.Name },
        });

        if (!country) {
          throw new BadRequestException('Country not found');
        }

        const existingData = await this.findOne({
          where: { date: data.data[i].date, country: country },
        });

        if (existingData)
          throw new BadRequestException(
            'Data is already available for the given Date and Country',
          );

        const timeData = {
          country: country,
          date: data.data[i].date,
          confirmed: data.data[i].confirmed,
          deaths: data.data[i].deaths,
          recovered: data.data[i].recovered,
        };

        const newData = this.create(timeData);
        await queryRunner.manager.save(newData);
      }
      await queryRunner.commitTransaction();
      return 'Data is added.';
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Could not complete the transaction', {
        description: String(error),
      });
    } finally {
      try {
        // Release connection
        await queryRunner.release();
      } catch (error) {
        throw new RequestTimeoutException('Could not release the connection', {
          description: String(error),
        });
      }
    }
  }

  async deleteData(data: DeleteTimeseriesDto) {
    const fromDate = new Date(data.from).toISOString();
    const toDate = new Date(data.to).toISOString();

    const deleteResult = await this.delete({
      country: { Name: data.name },
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
      where: { country: { Name: data.name }, date: data.date },
    });
  }
}
