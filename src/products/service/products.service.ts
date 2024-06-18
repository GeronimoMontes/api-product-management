import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError, Types } from 'mongoose';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductDoc } from '../interfaces/products-document.interface';
import { Product } from '../interfaces/products.interface';
import { Paginate, PaginateQueryRaw } from '../paginate/paginate';
import { getAllPaginated } from '../paginate/paginate.controler';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Products') private readonly productModel: Model<ProductDoc>,
  ) {}

  /**
   * Create a new product
   * @param
   * @returns
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = await this.productModel.create(createProductDto);
    return createdProduct;
  }

  /**
   * Retrieve all products
   * @param name
   * @returns
   */
  async findAll(paginateQry: PaginateQueryRaw): Promise<Paginate<Product>> {
    const response = await getAllPaginated(this.productModel, paginateQry);

    if (response.metadata.itemsPerPageCount <= 0)
      throw new NotFoundException('Items not found');

    return response;
  }

  /**
   * Check if a product name is unique
   * @param name
   * @returns
   */
  async isNameTaken(name: string): Promise<boolean> {
    const data = await this.productModel.find({ name: name });
    return data.length > 0;
  }

  /**
   * Retrieve a product by ID
   * @param name
   * @returns
   */
  async findOne(id: string): Promise<Product> {
    // if (!Types.ObjectId.isValid(id))
    //   throw new BadRequestException('Id no valid.');

    const product = await this.productModel.findOne({ _id: id }).exec();

    if (!product)
      throw new NotFoundException(`Product with id '${id}' not found`);

    return product;
  }

  /**
   * Update a product
   * @param name
   * @returns
   */
  async update(id: string, productDto: UpdateProductDto): Promise<Product> {
    // if (!Types.ObjectId.isValid(id))
    //   throw new BadRequestException('Id no valid.');

    const updatedProduct = await this.productModel
      .findOneAndUpdate({ _id: id }, productDto, { new: true })
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(`Product with id '${id}' not found`);
    }
    return updatedProduct;
  }

  /**
   * Delete a product
   * @param name
   * @returns
   */
  async remove(id: string): Promise<Product> {
    // if (!Types.ObjectId.isValid(id))
    //   throw new BadRequestException('Id no valid.');

    const deletedProduct = await this.productModel
      .findByIdAndDelete({ _id: id })
      .exec();

    if (!deletedProduct)
      throw new NotFoundException(`Product with id '${id}' not found`);

    return deletedProduct;
  }
}
