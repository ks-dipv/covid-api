import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './services/users.service';
import { CreateUserProvider } from './services/create-user.provider';
import { BcryptProvider } from './services/bcrypt.provider';
import { HashingProvider } from './services/hashing.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { TimeSeries } from '../country/entities/timeseries.entity';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    CreateUserProvider,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    BcryptProvider,
  ],
  imports: [TypeOrmModule.forFeature([User, TimeSeries])],
})
export class UsersModule {}
