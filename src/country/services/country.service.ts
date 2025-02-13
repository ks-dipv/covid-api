import { Injectable } from '@nestjs/common';
import { CountryRepository } from '../repositories/country.repository';
import { AddCountryDto } from '../dtos/add.dto';

@Injectable()
export class CountryService {
  constructor(
    /**
     * inject country repository
     */
    private readonly countryRepository: CountryRepository,
  ) {}

  public async add(countryData: AddCountryDto) {
    const newCountry = await this.countryRepository.create(countryData);
    return await this.countryRepository.save(newCountry);
  }
}
