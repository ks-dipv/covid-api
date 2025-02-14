import {
  IsOptional,
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class GetExcelDto {
  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  @ApiPropertyOptional({
    description: 'Enter the ISO Code',
    example: 'IN',
  })
  isoCodes?: string[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Enter the year',
    example: 2021,
  })
  year?: number;
}
