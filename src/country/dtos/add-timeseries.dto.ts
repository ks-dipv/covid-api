import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class AddTimeseriesDto {
  @ApiProperty({
    description: 'Date must be in YYYY-MM-DD format.',
    example: '2025-01-01',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'The number of confirmed cases.',
    example: 10,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  confirmed: number;

  @ApiProperty({
    description: 'The number of deaths.',
    example: 10,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  deaths: number;

  @ApiProperty({
    description: 'The number of recovered cases.',
    example: 10,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  recovered: number;
}

export class AddDto {
  @ApiProperty({
    description: 'The country of the timeseries entry.',
    example: 'India',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  Name: string;

  @ApiProperty({
    description: 'The data for the timeseries.',
    type: [AddTimeseriesDto],
  })
  @ValidateNested()
  @Type(() => AddTimeseriesDto)
  data: AddTimeseriesDto[];
}
