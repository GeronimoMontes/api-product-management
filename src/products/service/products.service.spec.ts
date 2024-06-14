import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Product } from '../interfaces/products.interface';
import { ProductDoc } from '../interfaces/products-document.interface';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';

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
  mockProduct('Meal Product 001', 'Meal Product 001: Description', 200),
  mockProduct('Meal Product 002', 'Meal Product 002: Description', 140),
];

const ProductDocArray: Partial<ProductDoc>[] = [
  mockProductDoc({
    _id: '0001',
    name: 'Meal Product 001',
    description: 'Meal Product 001: Description',
    price: 200,
  }),
  mockProductDoc({
    _id: '0002',
    name: 'Meal Product 002',
    description: 'Meal Product 002: Description',
    price: 140,
  }),
];

describe('ProductsService', () => {
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
            find: jest.fn(),
            countDocuments: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            sort: jest.fn(),
            limit: jest.fn(),
            skip: jest.fn(),
            findByIdAndDelete: jest.fn(),
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

  it('should create a product', async () => {
    jest
      .spyOn(model, 'create')
      .mockImplementationOnce(() => Promise.resolve(mockProductDoc() as any));
    const newProduct = await service.create(mockProduct());
    expect(newProduct).toEqual(mockProductDoc());
  });

  // it('should find all products', async () => {
  //   jest.spyOn(model, 'countDocuments').mockReturnValueOnce({
  //     exec: jest.fn().mockResolvedValueOnce(ProductDocArray),
  //   } as any);
  //   const products = await service.findAll();
  //   expect(products).toEqual(ProductDocArray);
  // });

  it('should find one product by id', async () => {
    const id = '0001';
    jest.spyOn(model, 'findOne').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(mockProductDoc()),
    } as any);
    const product = await service.findOne(id);
    expect(product).toEqual(mockProductDoc());
  });

  it('should update a product', async () => {
    const id = '0002';
    const updatedProduct = { ...mockProductDoc(), name: 'Updated Name' };
    jest.spyOn(model, 'findOneAndUpdate').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(updatedProduct),
    } as any);
    const result = await service.update(id, updatedProduct);
    expect(result).toEqual(updatedProduct);
  });

  it('should delete a product', async () => {
    const id = '0002';
    jest.spyOn(model, 'findByIdAndDelete').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(true),
    } as any);
    const result = await service.remove(id);
    expect(result).toEqual(true);
  });

  it('should throw an error if product not found', async () => {
    const id = '0002';
    jest.spyOn(model, 'findOne').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(null),
    } as any);
    await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
  });
});
