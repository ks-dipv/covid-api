import { Module } from '@nestjs/common';
import { CountryController } from './country.controller';
import { CountryService } from './services/country.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { TimeSeries } from './entities/timeseries.entity';
import { CountryRepository } from './repositories/country.repository';
import { TimeseriesController } from './timeseries.controller';
import { TimeseriesService } from './services/timeseries.service';
import { TotalCasesRepository } from './repositories/total-cases.repository';
import { TimeseriesRepository } from './repositories/timeseries.repository';
import { MonthCaseRepository } from './repositories/month-cases.repository';
import { TopRepository } from './repositories/top.repository';
import { ExcelController } from './excel.controller';
import { ExcelService } from './services/excel.service';

@Module({
  controllers: [CountryController, TimeseriesController, ExcelController],
  providers: [
    CountryService,
    CountryRepository,
    TimeseriesService,
    TotalCasesRepository,
    TimeseriesRepository,
    MonthCaseRepository,
    TopRepository,
    ExcelService,
  ],
  imports: [TypeOrmModule.forFeature([Country, TimeSeries])],
})
export class CountryModule {}
