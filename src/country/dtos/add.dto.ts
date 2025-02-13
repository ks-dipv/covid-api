import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddCountryDto {
  @ApiProperty({
    description: 'The name of the Country.',
    example: 'India',
  })
  @IsString()
  @IsNotEmpty()
  Name: string;

  @ApiProperty({
    description: 'The flag of the country.',
    example: 'IN',
  })
  @IsString()
  @IsNotEmpty()
  flag: string;

  @ApiProperty({
    description:
      'The code of the country, use 2-Digit code. It must be Unique.',
    example: 'IN',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
