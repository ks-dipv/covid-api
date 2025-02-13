import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetCasesDto {
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
    example: '2021-01-25',
  })
  toDate?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Enter the country code',
    example: 'IN',
  })
  countryCode?: string;
}
