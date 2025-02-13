import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeSeries } from '../entities/timeseries.entity';
import { Repository } from 'typeorm';
import { AddDto } from '../dtos/add-timeseries.dto';

@Injectable()
export class TimeseriesService {
  constructor(
    /**
     * inject timeseries repository
     */

    @InjectRepository(TimeSeries)
    private readonly timeseriesRepository: Repository<TimeSeries>,
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
}
