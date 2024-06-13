import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Product } from '../interfaces/products.interface';
import { ProductDoc } from '../interfaces/products-document.interface';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

// I'm lazy and like to have functions that can be re-used to deal with a lot of my initialization/creation logic
const mockProduct = (
  name = 'Meal Product',
  description = 'Meal Product',
  price = 400,
): Product => ({
  name,
  description,
  price,
});

// still lazy, but this time using an object instead of multiple parameters
const mockProductDoc = (mock?: Partial<Product>): Partial<ProductDoc> => ({
  name: mock?.name || 'Meal Product',
  description: mock?.description || 'description Meal Product',
  price: mock?.price || 400,
});

const ProductArray = [
  mockProduct(),
  mockProduct('Meal Product 001', 'Meal Product 001: Descrioption', 200),
  mockProduct('Meal Product 002', 'Meal Product 002: Descrioption', 140),
];

const ProductDocArray: Partial<ProductDoc>[] = [
  mockProductDoc(),
  mockProductDoc({name: 'Meal Product 001', description:'Meal Product 001: Descrioption', price:200}),
  mockProductDoc({name: 'Meal Product 002', description:'Meal Product 002: Descrioption', price:140}),
];

describe('ProductService', () => {
  let service: ProductsService;
  let model: Model<ProductDoc>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken('Products'),
          // notice that only the functions we call from the model are mocked
          useValue: {
            new: jest.fn().mockResolvedValue(mockProduct()),
            constructor: jest.fn().mockResolvedValue(mockProduct()),
            create: jest.fn(),
            findAll: jest.fn(),
            isNameTaken: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    model = module.get<Model<ProductDoc>>(getModelToken('Products'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
