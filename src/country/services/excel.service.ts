import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Workbook } from 'exceljs';
import { TimeSeries } from '../entities/timeseries.entity';
import { Country } from '../entities/country.entity';

@Injectable()
export class ExcelService {
  constructor(
    /**
     * Inject timeseries Repository
     */
    @InjectRepository(TimeSeries)
    private readonly timeseriesRepo: Repository<TimeSeries>,

    /**
     * Inject country Repository
     */
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,
  ) {}

  async generateExcel(isoCodes?: string[], year?: number) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('COVID Data');

    worksheet.columns = [
      { header: 'Country', key: 'country', width: 30 },
      { header: 'Year-Month', key: 'monthYear', width: 15 },
      { header: 'Total Confirmed', key: 'confirmed', width: 20 },
      { header: 'Total Deaths', key: 'deaths', width: 20 },
      { header: 'Total Recovered', key: 'recovered', width: 20 },
    ];

    const countries = await this.countryRepo.find({
      where: isoCodes ? { code: In(isoCodes) } : {},
    });

    const countryNames = countries.map((country) => country.Name);

    const timeseriesData = await this.timeseriesRepo
      .createQueryBuilder('timeseries')
      .select('timeseries.Name', 'country')
      .addSelect('SUBSTRING(timeseries.date, 1, 7) AS monthYear')
      .addSelect('SUM(timeseries.confirmed)', 'confirmed')
      .addSelect('SUM(timeseries.deaths)', 'deaths')
      .addSelect('SUM(timeseries.recovered)', 'recovered')
      .where('timeseries.Name IN (:...countryNames)', { countryNames })
      .andWhere(year ? 'SUBSTRING(timeseries.date, 1, 4) = :year' : '1=1', {
        year,
      })
      .groupBy('timeseries.Name, monthYear')
      .getRawMany();

    if (!timeseriesData || timeseriesData.length === 0) {
      console.error('No data found for the given query parameters');
      return workbook;
    }

    timeseriesData.forEach((row) => {
      worksheet.addRow({
        country: row.country,
        monthYear: row.monthyear,
        confirmed: row.confirmed,
        deaths: row.deaths,
        recovered: row.recovered,
      });
    });

    return workbook;
  }
}
