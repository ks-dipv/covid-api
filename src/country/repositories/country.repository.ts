import { Injectable } from '@nestjs/common';
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
