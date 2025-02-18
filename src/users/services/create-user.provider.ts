import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashingProvider } from './hashing.provider';
import { User } from '../entities/user.entity';

@Injectable()
export class CreateUserProvider {
  constructor(
    /**
     * injecting usersRepository
     */
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    /**
     * inject hashing provider
     */
    private readonly hashingProvider: HashingProvider,
  ) {}
  public async createUser(createUserDto: CreateUserDto) {
    let existingUser = undefined;

    try {
      // check if user exists with same email
      existingUser = await this.usersRepository.findOne({
        where: {
          email: createUserDto.email,
        },
      });
    } catch {
      //Might savae the details of the exception
      //information which is sensitive
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
    // check if user exists with same email
    await this.usersRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    // handle exception
    if (existingUser) {
      throw new BadRequestException(
        'User already exists, please check your email.',
      );
    }

    //create a new user
    let newUser = this.usersRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });

    try {
      newUser = await this.usersRepository.save(newUser);
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    return newUser;
  }
}
