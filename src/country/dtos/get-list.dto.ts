import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetListDto {
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
}
