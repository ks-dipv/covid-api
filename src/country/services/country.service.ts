import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CountryRepository } from '../repositories/country.repository';
import { AddCountryDto, UpdateDto } from '../dtos/country.dto';

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
    const country = await this.countryRepository.findOne({
      relations: { timeseries: true },
      where: { id: id },
    });
    if (country.timeseries.length > 0) {
      throw new BadRequestException(
        'This country is not deleted because, it have timeseries data.',
      );
    }
    return await this.countryRepository.remove(country);
  }

  public async getCountry(id: number) {
    const country = await this.countryRepository.findOne({
      where: { id: id },
    });

    if (!country) throw new NotFoundException('Coutnry is not found.');
    const data = await this.countryRepository.findOne({
      relations: { timeseries: true },
      where: { id: id },
    });
    return data;
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
}
