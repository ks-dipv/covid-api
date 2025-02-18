import { Injectable } from '@nestjs/common';

import { CreateUserDto } from '../dtos/create-user.dto';
import { CreateUserProvider } from './create-user.provider';

/** Class to connect to Users table and perform business operations */
@Injectable()
export class UsersService {
  /** inject auth service */
  constructor(private readonly createUserProvider: CreateUserProvider) {}

  public async createUser(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }
}
