import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateUsersDto } from '../dto/create-users.dto';
import { User } from '../interfaces/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { UserDoc } from '../interfaces/users-document.interface.';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users') private readonly userModel: Model<UserDoc>,
  ) {}

  create(createUserDto: CreateUsersDto): Promise<User> {
    const createUser = this.userModel.create(createUserDto);
    return createUser;
  }

  findOne(username: string): Promise<User> {
    return this.userModel.findOne({ username: username }).exec();
  }
}
