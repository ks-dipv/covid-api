import { BadRequestException, Injectable } from '@nestjs/common';
import {
  AddDto,
  DeleteTimeseriesDto,
  UpdateTimeseriesDto,
} from '../dtos/timeseries.dto';
import { TotalCasesRepository } from '../repositories/total-cases.repository';
import { TimeseriesRepository } from '../repositories/timeseries.repository';
import { MonthCaseRepository } from '../repositories/month-cases.repository';
import { TopRepository } from '../repositories/top.repository';
import { PaginationProvider } from '../../common/pagination/providers/pagination.provider';
import { PaginationQueryDto } from '../../common/pagination/dtos/pagination.dto';

@Injectable()
export class TimeseriesService {
  constructor(
    private readonly totalCasesRepository: TotalCasesRepository,

    private readonly timeseriesRepository: TimeseriesRepository,

    private readonly monthCaseRepository: MonthCaseRepository,

    private readonly topCasesRepository: TopRepository,

    /**
     * injecting pagination provider
     */
    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async createTimeseries(data: AddDto) {
    return await this.timeseriesRepository.entry(data);
  }

  public async updateTimeseries(data: UpdateTimeseriesDto) {
    const existingData = await this.timeseriesRepository.updateData(data);
    if (!existingData)
      throw new BadRequestException(
        'Data is not available for given date and country.',
      );
    Object.assign(existingData, data);
    return await this.timeseriesRepository.save(existingData);
  }

  public async deleteTimeseries(data: DeleteTimeseriesDto) {
    const fromDate = new Date(data.from).getTime();
    const toDate = new Date(data.to).getTime();
    const countryData = await this.timeseriesRepository.find({
      where: { Name: data.name },
    });
    const filterData = await countryData.filter((data) => {
      const date = new Date(data.date).getTime() ?? null;
      if (fromDate <= date && date <= toDate) return data;
    });
    const ids = filterData.map((data) => data.id);
    await this.timeseriesRepository.delete(ids);
    return 'Data is deleted.';
  }

  public async getCases(fromDate?: string, toDate?: string, code?: string) {
    const result = await this.totalCasesRepository.getCases(
      fromDate,
      toDate,
      code,
    );

    return {
      confirmed: Number(result.confirmed),
      deaths: Number(result.deaths),
      recovered: Number(result.recovered),
    };
  }

  public async eachCase(
    fromDate?: string,
    toDate?: string,
    confirmedGte?: number,
    confirmedLte?: number,
  ) {
    const result = await this.timeseriesRepository.getCases(
      fromDate,
      toDate,
      confirmedGte,
      confirmedLte,
    );

    return result.map((record) => ({
      country: record.country,
      totals: {
        confirmed: Number(record.confirmed),
        deaths: Number(record.deaths),
        recovered: Number(record.recovered),
      },
    }));
  }

  public async getTopCase(fromDate?: string, toDate?: string, top?: number) {
    const result = await this.topCasesRepository.getTopCases(
      fromDate,
      toDate,
      top,
    );

    return result.map((record) => ({
      country: record.country,
      totals: {
        confirmed: Number(record.confirmed),
        deaths: Number(record.deaths),
        recovered: Number(record.recovered),
      },
    }));
  }

  public async getMonthCase(
    fromDate?: string,
    toDate?: string,
    confirmedGte?: number,
    confirmedLte?: number,
  ) {
    const result = await this.monthCaseRepository.getMonthCase(
      fromDate,
      toDate,
      confirmedGte,
      confirmedLte,
    );

    return result.map((record) => ({
      country: record.country,
      month: record.month,
      confirmed: Number(record.confirmed),
      deaths: Number(record.deaths),
      recovered: Number(record.recovered),
    }));
  }

  public async getTimeseries(timeseriesQuery: PaginationQueryDto) {
    const timeseries = await this.paginationProvider.paginateQuery(
      {
        limit: timeseriesQuery.limit,
        page: timeseriesQuery.page,
      },
      this.timeseriesRepository,
    );
    return timeseries;
  }
}
