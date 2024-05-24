import { Mongoose } from 'mongoose';
import { UserSchema } from './schemas/users.schemas';

export const usersProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('Users', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
