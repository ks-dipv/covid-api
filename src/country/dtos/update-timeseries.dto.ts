import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateTimeseriesDto {
  @ApiProperty({
    description: 'The name if the country.',
    example: 'India',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Date must be in YYYY-MM-DD format and unique.',
    example: '2025-01-01',
    type: String,
  })
  @IsDateString()
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'The number of confirmed cases.',
    example: 1000,
    type: Number,
    required: false,
  })
  @IsNotEmpty()
  @IsNumber()
  confirmed?: number;

  @ApiProperty({
    description: 'The number of deaths.',
    example: 1000,
    type: Number,
    required: false,
  })
  @IsNotEmpty()
  @IsNumber()
  deaths?: number;

  @ApiProperty({
    description: 'The number of recovered cases.',
    example: 1000,
    type: Number,
    required: false,
  })
  @IsNotEmpty()
  @IsNumber()
  recovered?: number;
}
