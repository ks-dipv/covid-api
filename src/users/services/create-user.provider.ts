import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { HashingProvider } from './hashing.provider';
import { User } from '../entities/user.entity';
import { TimeSeries } from 'src/country/entities/timeseries.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(TimeSeries)
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new BadRequestException(
        'User already exists, please check your email.',
      );
    }

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
      subscription: createUserDto.subscription || [],
    });
    await this.usersRepository.save(newUser);
  }
}
