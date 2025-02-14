import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CountryService } from './services/country.service';
import { AddCountryDto, UpdateDto } from './dtos/country.dto';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { FilterDto } from './dtos/filter.dto';

@Controller('api/country')
export class CountryController {
  constructor(
    /**
     * inject country service
     */
    private readonly countryService: CountryService,
  ) {}

  @Post('entry')
  @ApiOperation({
    summary: 'Add country',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfuly add country data',
  })
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
  public getCountries(@Query() getList: FilterDto) {
    const { name, code } = getList;
    return this.countryService.list(name, code);
  }

  @Put('update')
  @ApiOperation({
    summary: 'Update country',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfuly update country data',
  })
  public updateCountry(@Body() updateCountryDto: UpdateDto) {
    return this.countryService.update(updateCountryDto);
  }

  @Delete('delete')
  @ApiOperation({
    summary: 'Delete country',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfuly delete country data',
  })
  public deleteCountry(@Query('id', ParseIntPipe) id: number) {
    return this.countryService.delete(id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'get country by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfuly get country data for specific id',
  })
  public getCountry(@Param('id', ParseIntPipe) id: number) {
    return this.countryService.getCountry(id);
  }
}
