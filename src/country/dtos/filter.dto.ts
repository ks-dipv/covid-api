import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class FilterDto {
  @ApiPropertyOptional({
    description: 'Enter the name of the country',
    example: 'India',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Enter the IsoCode of the country',
    example: 'IN',
  })
  @IsString()
  @IsOptional()
  code?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Enter the starting date',
    example: '2020-01-11',
  })
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Enter the ending date',
    example: '2020-01-25',
  })
  toDate?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({
    description:
      'Enter the number from greater than or equal confirmed data given',
    example: 500,
  })
  confirmedGte?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({
    description:
      'EEnter the number from less than or equal confirmed data given',
    example: 500,
  })
  confirmedLte?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(15)
  @ApiPropertyOptional({
    description:
      'Enter the number fot top N countries with highest number of confirmed cases',
    example: 10,
  })
  top?: number;
}
