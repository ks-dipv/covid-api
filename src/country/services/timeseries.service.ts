import { BadRequestException, Injectable } from '@nestjs/common';
import { AddDto } from '../dtos/add-timeseries.dto';
import { TimeseriesRepository } from '../repositories/timeseries.repository';

@Injectable()
export class TimeseriesService {
  constructor(
    /**
     * inject timeseries repository
     */

    private readonly timeseriesRepository: TimeseriesRepository,
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

  public async getCases(
    fromDate?: string,
    toDate?: string,
    countryCode?: string,
  ) {
    return this.timeseriesRepository.getCases(fromDate, toDate, countryCode);
  }
}
