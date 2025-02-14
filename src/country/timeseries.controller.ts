import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TimeseriesService } from './services/timeseries.service';
import {
  AddDto,
  DeleteTimeseriesDto,
  UpdateTimeseriesDto,
} from './dtos/timeseries.dto';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { FilterDto } from './dtos/filter.dto';

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
  public getCases(@Query() getCases: FilterDto) {
    const { fromDate, toDate, code } = getCases;
    return this.timeseriesService.getCases(fromDate, toDate, code);
  }

  @Put('update')
  @ApiOperation({
    summary: 'Update timeseries data',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfuly update timeseries data',
  })
  @UsePipes(new ValidationPipe())
  async updateTimeseries(@Body() data: UpdateTimeseriesDto) {
    return await this.timeseriesService.updateTimeseries(data);
  }

  @Delete('delete')
  @ApiOperation({
    summary: 'Delete timeseries data',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfuly delete timeseries data',
  })
  @UsePipes(new ValidationPipe())
  async deleteTime(@Body() data: DeleteTimeseriesDto) {
    return await this.timeseriesService.deleteTimeseries(data);
  }

  @Get('eachCase')
  @ApiOperation({
    summary: 'Get cases numbers country wise',
  })
  @ApiResponse({
    status: 200,
    description: 'Countries cases data fetched successfully based on the query',
  })
  @ApiQuery({
    name: 'fromDate',
    type: 'string',
    required: false,
    description: 'return countries total data based on query',
    example: '2020-01-11',
  })
  @ApiQuery({
    name: 'toDate',
    type: 'string',
    required: false,
    description: 'return countries total data based on query',
    example: '2020-01-25',
  })
  @ApiQuery({
    name: 'confirmedGte',
    type: 'number',
    required: false,
    description: 'return total data based on given in query',
    example: 500,
  })
  @ApiQuery({
    name: 'confirmedLte',
    type: 'number',
    required: false,
    description: 'return total data based on given in query',
    example: 500,
  })
  public eachCase(@Query() eachCase: FilterDto) {
    const { fromDate, toDate, confirmedGte, confirmedLte } = eachCase;
    return this.timeseriesService.eachCase(
      fromDate,
      toDate,
      confirmedGte,
      confirmedLte,
    );
  }

  @Get('topCases')
  @ApiOperation({
    summary: 'Get top N countries with highest confirmed cases',
  })
  @ApiResponse({
    status: 200,
    description:
      'Response contains top N countries with highest number of confirmed cases',
  })
  @ApiQuery({
    name: 'fromDate',
    type: 'string',
    required: false,
    description: 'return top N countries data based on query',
    example: '2020-01-11',
  })
  @ApiQuery({
    name: 'toDate',
    type: 'string',
    required: false,
    description: 'return top N countries data based on query',
    example: '2020-01-25',
  })
  @ApiQuery({
    name: 'top',
    type: 'number',
    required: false,
    description: 'return top N countries data based on in query',
    example: 5,
  })
  public getTopCases(@Query() getTopCases: FilterDto) {
    const { fromDate, toDate, top } = getTopCases;
    return this.timeseriesService.getTopCase(fromDate, toDate, top);
  }

  @Get('monthCase')
  @ApiOperation({
    summary: 'Get cases numbers month wise',
  })
  @ApiResponse({
    status: 200,
    description:
      'Month wise countries cases data fetched successfully based on the query',
  })
  @ApiQuery({
    name: 'fromDate',
    type: 'string',
    required: false,
    description: 'return monthwise countries total data based on query',
    example: '2020-01-11',
  })
  @ApiQuery({
    name: 'toDate',
    type: 'string',
    required: false,
    description: 'return monthwise countries total data based on query',
    example: '2020-01-25',
  })
  @ApiQuery({
    name: 'confirmedGte',
    type: 'number',
    required: false,
    description: 'return monthwise total data based on given in query',
    example: 500,
  })
  @ApiQuery({
    name: 'confirmedLte',
    type: 'number',
    required: false,
    description: 'return monthwise total data based on given in query',
    example: 500,
  })
  public getMonthCases(@Query() getMonthCases: FilterDto) {
    const { fromDate, toDate, confirmedGte, confirmedLte } = getMonthCases;
    return this.timeseriesService.getMonthCase(
      fromDate,
      toDate,
      confirmedGte,
      confirmedLte,
    );
  }
}
