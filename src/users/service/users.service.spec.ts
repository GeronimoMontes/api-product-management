import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../interfaces/users.interface';
import { UserDoc } from '../interfaces/users-document.interface.';

const mockUser = (username = 'test', password = '123'): User => ({
  username,
  password,
});

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<UserDoc>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('Users'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser()),
            constructor: jest.fn().mockResolvedValue(mockUser()),
            create: jest.fn(),
            findOne: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<UserDoc>>(getModelToken('Users'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
