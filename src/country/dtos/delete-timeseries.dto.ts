import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class DeleteTimeseriesDto {
  @ApiProperty({
    description: 'The name if the country.',
    example: 'India',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Start date for the range in YYYY-MM-DD format',
    example: '2025-12-31',
    type: String,
    required: false,
  })
  @IsDateString()
  @IsNotEmpty()
  from?: string;

  @ApiProperty({
    description: 'End date for the range in YYYY-MM-DD format',
    example: '2025-12-31',
    type: String,
    required: false,
  })
  @IsDateString()
  @IsNotEmpty()
  to?: string;
}
