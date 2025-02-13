import { BadRequestException, Injectable } from '@nestjs/common';
import { AddDto } from '../dtos/add-timeseries.dto';
import { TimeseriesRepository } from '../repositories/timeseries.repository';
import { EachCasesRepository } from '../repositories/each-cases.repository';

@Injectable()
export class TimeseriesService {
  constructor(
    private readonly timeseriesRepository: TimeseriesRepository,

    private readonly eachcasesRepository: EachCasesRepository,
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

  public getCases(fromDate?: string, toDate?: string, countryCode?: string) {
    return this.timeseriesRepository.getCases(fromDate, toDate, countryCode);
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
}
