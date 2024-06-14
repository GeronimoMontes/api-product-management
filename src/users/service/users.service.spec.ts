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

const mockUserDoc = (mock?: Partial<User>): Partial<UserDoc> => ({
  username: mock?.username || 'test',
  password: mock?.password || '123',
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

  it('should create a user', async () => {
    jest
      .spyOn(model, 'create')
      .mockImplementationOnce(() => Promise.resolve(mockUserDoc() as any));
    const newUser = await service.create(mockUser());
    expect(newUser).toEqual(mockUserDoc());
  });

  it('should find one user by username', async () => {
    const username = 'test';
    jest.spyOn(model, 'findOne').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(mockUserDoc()),
    } as any);
    const user = await service.findOne(username);
    expect(user).toEqual(mockUserDoc());
  });
});
