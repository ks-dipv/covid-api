import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CountryService } from './services/country.service';
import { AddCountryDto } from './dtos/add.dto';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GetListDto } from './dtos/get-list.dto';

@Controller('api/country')
export class CountryController {
  constructor(
    /**
     * inject country service
     */
    private readonly countryService: CountryService,
  ) {}

  @Post('entry')
  public add(@Body() countryDto: AddCountryDto) {
    return this.countryService.add(countryDto);
  }

  @Get('list')
  @ApiOperation({
    summary: 'Fetches a list of Countries',
  })
  @ApiResponse({
    status: 200,
    description: 'Countries fetched successfully based on the query',
  })
  @ApiQuery({
    name: 'name',
    type: 'string',
    required: false,
    description: 'return countries based on query',
    example: 'India',
  })
  @ApiQuery({
    name: 'code',
    type: 'string',
    required: false,
    description: 'return country based on the code given in query',
    example: 'In',
  })
  public getCountries(@Query() getList: GetListDto) {
    const { name, code } = getList;
    return this.countryService.list(name, code);
  }
}
