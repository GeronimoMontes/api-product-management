import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { ProductDoc } from '../interfaces/products-document.interface';
import { Product } from '../interfaces/products.interface';
import { Metadata, Paginate, PaginateQueryRaw } from '../paginate/paginate';
import { ProductsService } from './products.service';

const mockProduct = (
  name = 'Meal Product',
  description = 'Meal Product',
  price = 400,
): Product => ({ name, description, price });

const mockProductDoc = (mock?: Partial<Product>): Partial<ProductDoc> => ({
  _id: mock?._id || 'mockId',
  name: mock?.name || 'Meal Product',
  description: mock?.description || 'description Meal Product',
  price: mock?.price || 400,
});

const mockParamsPaginate = (
  mock?: Partial<PaginateQueryRaw>,
): PaginateQueryRaw => ({
  limit: mock?.limit || 25,
  page: mock?.page || 1,
  search: mock?.search || '',
});

const paramsFindAll = mockParamsPaginate();

const mockPaginatedProducts: Partial<Paginate<Partial<ProductDoc>>> = {
  data: [mockProductDoc()],
  metadata: undefined,
};
describe('ProductsService', () => {
  let service: ProductsService;
  let model: Model<ProductDoc>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken('Products'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockProduct() as any),

            constructor: jest.fn().mockResolvedValue(mockProduct() as any),
            create: jest.fn(),
            find: jest.fn(),
            countDocuments: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            sort: jest.fn(),
            limit: jest.fn(),
            estimatedDocumentCount: jest.fn(),
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
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    it('should create a product', async () => {
      jest
        .spyOn(model, 'create')
        .mockResolvedValueOnce(mockProductDoc() as any);

      const newProduct = await service.create(mockProduct());
      expect(newProduct).toEqual(mockProductDoc());
    });
  });
  describe('findAll', () => {
    it('should return paginated products', async () => {
      jest.spyOn(model, 'find').mockReturnValueOnce({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValueOnce(mockPaginatedProducts.data),
            }),
          }),
        }),
      } as any);

      const products = await service.findAll(paramsFindAll);
      expect(products.data).toEqual(mockPaginatedProducts.data);
    });
  });
  describe('isNameTaken', () => {
    it('should return true if name is taken', async () => {
      jest.spyOn(model, 'find').mockResolvedValueOnce([mockProductDoc()]);

      const result = await service.isNameTaken('Meal Product');
      expect(result).toBe(true);
    });
    it('should return false if name is not taken', async () => {
      jest.spyOn(model, 'find').mockResolvedValueOnce([]);

      const result = await service.isNameTaken('Nonexistent Product');
      expect(result).toBe(false);
    });
  });
  describe('findOne', () => {
    it('should return a product if found', async () => {
      const mockId = 'mockId';
      jest.spyOn(model, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockProductDoc()),
      } as any);

      const product = await service.findOne(mockId);
      expect(product).toEqual(mockProductDoc());
    });
  });
  describe('update', () => {
    it('should update and return the product', async () => {
      const mockId = 'mockId';

      const updatedProduct = { ...mockProductDoc(), name: 'Updated Name' };
      jest.spyOn(model, 'findOneAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(updatedProduct),
      } as any);

      const result = await service.update(mockId, updatedProduct as any);
      expect(result).toEqual(updatedProduct);
    });
  });
  describe('remove', () => {
    it('should delete and return the product', async () => {
      const mockId = 'mockId';
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(true),
      } as any);

      const result = await service.remove(mockId);
      expect(result).toBe(true);
    });
  });
});
