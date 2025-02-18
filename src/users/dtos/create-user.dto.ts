import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(96)
  @ApiProperty({
    description: 'First name of the user',
    example: 'Tom',
    required: true,
  })
  firstName: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(96)
  @ApiProperty({
    description: 'Last name of the user',
    example: 'Cruis',
    required: false,
  })
  lastName?: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(96)
  @ApiProperty({
    description: 'Email of the user',
    example: 'tom@gmail.com',
    required: true,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(96)
  @Matches(/^(?=.*[A-Za-z])(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Minimum 8 character, at least one letter, one number and one special character',
  })
  @ApiProperty({
    description: 'Password of the user',
    example: 'Tom@123',
    required: true,
  })
  password: string;
}
