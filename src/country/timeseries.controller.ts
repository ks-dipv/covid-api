import { Body, Controller, Post } from '@nestjs/common';
import { TimeseriesService } from './services/timeseries.service';
import { AddDto } from './dtos/add-timeseries.dto';

@Controller('/api/country/timeseries')
export class TimeseriesController {
  constructor(
    /**
     * inject timeseries service
     */
    private readonly timeseriesService: TimeseriesService,
  ) {}

  @Post('entry')
  async createTimeseries(@Body() data: AddDto) {
    return await this.timeseriesService.createTimeseries(data);
  }
}
