import { BadRequestException, Injectable } from '@nestjs/common';
import {
  AddDto,
  DeleteTimeseriesDto,
  UpdateTimeseriesDto,
} from '../dtos/timeseries.dto';
import { EachCasesRepository } from '../repositories/each-cases.repository';
import { TopRepository } from '../repositories/top.repository';
import { TotalCasesRepository } from '../repositories/total-cases.repository';
import { TimeseriesRepository } from '../repositories/timeseries.repository';
import { MonthCaseRepository } from '../repositories/month-cases.repository';

@Injectable()
export class TimeseriesService {
  constructor(
    private readonly totalCasesRepository: TotalCasesRepository,

    private readonly eachcasesRepository: EachCasesRepository,

    private readonly topcasesRepository: TopRepository,

    private readonly timeseriesRepository: TimeseriesRepository,

    private readonly monthCaseRepository: MonthCaseRepository,
  ) {}

  public async createTimeseries(data: AddDto) {
    for (let i = 0; i < data.data.length; i++) {
      const existingData = await this.timeseriesRepository.findOne({
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
      const newData = await this.timeseriesRepository.create(timeData);
      await this.timeseriesRepository.save(newData);
    }
    return 'Data is added.';
  }

  public async updateTimeseries(data: UpdateTimeseriesDto) {
    const existingData = await this.timeseriesRepository.findOne({
      where: { Name: data.name, date: data.date },
    });
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

  public getCases(fromDate?: string, toDate?: string, code?: string) {
    return this.totalCasesRepository.getCases(fromDate, toDate, code);
  }

  public eachCase(
    fromDate?: string,
    toDate?: string,
    confirmedGte?: number,
    confirmedLte?: number,
  ) {
    return this.eachcasesRepository.eachCase(
      fromDate,
      toDate,
      confirmedGte,
      confirmedLte,
    );
  }

  public getTopCase(fromDate?: string, toDate?: string, top?: number) {
    return this.topcasesRepository.getTopCases(fromDate, toDate, top);
  }

  public getMonthCase(
    fromDate?: string,
    toDate?: string,
    confirmedGte?: number,
    confirmedLte?: number,
  ) {
    return this.monthCaseRepository.getMonthCase(
      fromDate,
      toDate,
      confirmedGte,
      confirmedLte,
    );
  }
}
