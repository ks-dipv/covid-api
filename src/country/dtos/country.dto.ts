import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

export class UpdateDto {
  @ApiProperty({
    description: 'The id of the country',
    example: '6',
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  id: number;

  @ApiProperty({
    description: 'The name of the country',
    example: 'India',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    description: 'The flag of the country',
    example: 'IN',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  flag?: string;

  @ApiProperty({
    description: 'The code of the country, use only 2-digit code',
    example: 'IN',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  code?: string;
}
