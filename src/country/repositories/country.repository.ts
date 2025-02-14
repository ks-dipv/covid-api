import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Country } from '../entities/country.entity';

@Injectable()
export class CountryRepository extends Repository<Country> {
  constructor(private dataSource: DataSource) {
    super(Country, dataSource.createEntityManager());
  }

  async getByCode(code: string) {
    return this.findOne({ where: { code: code } });
  }

  async fetch(id: number) {
    const country = await this.findOne({
      where: { id: id },
    });

    if (!country) throw new NotFoundException('Coutnry is not found.');
    const data = await this.findOne({
      relations: { timeseries: true },
      where: { id: id },
    });
    return data;
  }

  async deleteCountry(id: number) {
    const country = await this.findOne({
      relations: { timeseries: true },
      where: { id: id },
    });
    if (country.timeseries.length > 0) {
      throw new BadRequestException(
        'This country is not deleted because, it have timeseries data.',
      );
    }
    return await this.remove(country);
  }

  async list(name?: string, code?: string) {
    if (name) {
      return await this.findOne({
        where: { Name: name },
      });
    }

    if (code) {
      return await this.findOne({
        where: { code: code },
      });
    }
  }
}
