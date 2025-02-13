import { Body, Controller, Post } from '@nestjs/common';
import { CountryService } from './services/country.service';
import { AddCountryDto } from './dtos/add.dto';

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
}
