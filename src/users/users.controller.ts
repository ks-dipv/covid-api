import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('api/user')
export class UsersController {
  constructor(
    // Injecting Users Service
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a user',
  })
  @ApiResponse({
    status: 200,
    description: 'Users created successfully',
  })
  public createUsers(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
}
