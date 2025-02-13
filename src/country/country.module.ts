import { Module } from '@nestjs/common';
import { CountryController } from './country.controller';
import { CountryService } from './services/country.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { TimeSeries } from './entities/timeseries.entity';
import { CountryRepository } from './repositories/country.repository';
import { TimeseriesController } from './timeseries.controller';
import { TimeseriesService } from './services/timeseries.service';
import { EachCasesRepository } from './repositories/each-cases.repository';
import { TopRepository } from './repositories/top.repository';
import { TotalCasesRepository } from './repositories/total-cases.repository';
import { TimeseriesRepository } from './repositories/timeseries.repository';

@Module({
  controllers: [CountryController, TimeseriesController],
  providers: [
    CountryService,
    CountryRepository,
    TimeseriesService,
    EachCasesRepository,
    TopRepository,
    TotalCasesRepository,
    TimeseriesRepository,
  ],
  imports: [TypeOrmModule.forFeature([Country, TimeSeries])],
})
export class CountryModule {}
