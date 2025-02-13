import { Module } from '@nestjs/common';
import { CountryController } from './country.controller';
import { CountryService } from './services/country.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { TimeSeries } from './entities/timeseries.entity';
import { CountryRepository } from './repositories/country.repository';
import { TimeseriesController } from './timeseries.controller';
import { TimeseriesService } from './services/timeseries.service';

@Module({
  controllers: [CountryController, TimeseriesController],
  providers: [CountryService, CountryRepository, TimeseriesService],
  imports: [TypeOrmModule.forFeature([Country, TimeSeries])],
})
export class CountryModule {}
