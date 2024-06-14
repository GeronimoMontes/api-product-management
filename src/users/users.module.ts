import { Module } from '@nestjs/common';
import { UsersService } from './service/users.service';
import { UserSchema } from './schemas/users.schemas';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Users', schema: UserSchema }])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
