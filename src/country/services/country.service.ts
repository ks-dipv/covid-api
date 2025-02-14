import { Injectable } from '@nestjs/common';
import { CountryRepository } from '../repositories/country.repository';
import { AddCountryDto, UpdateDto } from '../dtos/country.dto';
import { PaginationProvider } from '../../common/pagination/providers/pagination.provider';
import { PaginationQueryDto } from '../../common/pagination/dtos/pagination.dto';

@Injectable()
export class CountryService {
  constructor(
    /**
     * inject country repository
     */
    private readonly countryRepository: CountryRepository,

    /**
     * injecting pagination provider
     */
    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async add(countryData: AddCountryDto) {
    const newCountry = await this.countryRepository.create(countryData);
    return await this.countryRepository.save(newCountry);
  }

  public async update(updateCountryDataDto: UpdateDto) {
    //find the country
    const existantCountry = await this.countryRepository.findOneBy({
      id: updateCountryDataDto.id,
    });

    //update country
    existantCountry.Name = updateCountryDataDto.name ?? existantCountry.Name;
    existantCountry.code = updateCountryDataDto.code ?? existantCountry.code;
    existantCountry.flag = updateCountryDataDto.flag ?? existantCountry.flag;

    //save updated country
    return await this.countryRepository.save(existantCountry);
  }

  public async delete(id: number) {
    return await this.countryRepository.deleteCountry(id);
  }

  public async getCountry(id: number) {
    return await this.countryRepository.fetch(id);
  }

  public async list(name?: string, code?: string) {
    let result = undefined;

    if (!name && !code) {
      result = await this.countryRepository.find();
    } else {
      result = this.countryRepository.list(name, code);
    }

    return result;
  }

  public async getAllCountry(countryQuery: PaginationQueryDto) {
    const country = await this.paginationProvider.paginateQuery(
      {
        limit: countryQuery.limit,
        page: countryQuery.page,
      },
      this.countryRepository,
    );
    return country;
  }
}
