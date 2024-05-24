import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateUsersDto } from './dto/create-users.dto';
import { User } from './interfaces/users.interface';

@Injectable()
export class UsersService {

  constructor(@Inject('USER_MODEL') private readonly userModel: Model<User>) { }

  create(createUserDto: CreateUsersDto): Promise<User> {
    const createUser = this.userModel.create(createUserDto);
    return createUser;
  }

  findOne(username: string): Promise<User> {
    return this.userModel.findOne({ "username": username }).exec();
  }
}
