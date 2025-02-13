import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TimeseriesService } from './services/timeseries.service';
import { AddDto } from './dtos/add-timeseries.dto';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GetCasesDto } from './dtos/cases.dto';

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

  @Get('totalcases')
  @ApiOperation({
    summary: 'Get overview of cases from all countries',
  })
  @ApiResponse({
    status: 200,
    description: 'Countries data fetched successfully based on the query',
  })
  @ApiQuery({
    name: 'fromDate',
    type: 'string',
    required: false,
    description: 'return countries data based on query',
    example: '2020-01-11',
  })
  @ApiQuery({
    name: 'toDate',
    type: 'string',
    required: false,
    description: 'return countries data based on query',
    example: '2020-01-25',
  })
  @ApiQuery({
    name: 'countryCode',
    type: 'string',
    required: false,
    description: 'return country based on the code given in query',
    example: 'IN',
  })
  public getCases(@Query() getCases: GetCasesDto) {
    const { fromDate, toDate, countryCode } = getCases;
    return this.timeseriesService.getCases(fromDate, toDate, countryCode);
  }
}
