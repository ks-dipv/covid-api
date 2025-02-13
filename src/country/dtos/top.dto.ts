import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetTopCountries {
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Enter the starting date',
    example: 'India',
  })
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Enter the ending date',
    example: 'India',
  })
  toDate?: string;

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
