import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../interfaces/products.interface';
import { InjectModel } from '@nestjs/mongoose';
import { ProductDoc } from '../interfaces/products-document.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Products') private readonly productModel: Model<ProductDoc>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const createdProduct = await this.productModel.create(createProductDto);
      return createdProduct;
    } catch (error) {
      // Handle specific errors or rethrow for general handling
      throw new Error(`Could not create product: ${error.message}`);
    }
  }

  async findAll(limit = 25, skip = 0, search = ''): Promise<any> {
    try {
      const qry = search !== '' ? { $text: { $search: `\"${search}\"` } } : {};
      const count = await this.productModel.countDocuments(qry).exec();
      const page_total = Math.floor((count - 1) / limit) + 1;
      const data = await this.productModel
        .find(qry)
        .sort({ name: 'ascending', description: 'ascending' })
        .limit(limit)
        .skip(skip)
        .exec();

      return {
        data: data,
        count_current_data: data.length,
        countPages: page_total,
        resultsCount: count,
      };
    } catch (error) {
      // Handle specific errors or rethrow for general handling
      throw new Error(`Could not fetch products: ${error.message}`);
    }
  }

  async isNameTaken(name: string): Promise<boolean> {
    try {
      const data = await this.productModel.find({ name }).exec();
      return data.length > 0;
    } catch (error) {
      // Handle specific errors or rethrow for general handling
      throw new Error(
        `Could not check if name '${name}' is taken: ${error.message}`,
      );
    }
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findOne({ _id: id }).exec();
    if (!product) {
      throw new NotFoundException(`Product with id '${id}' not found`);
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      const updatedProduct = await this.productModel
        .findOneAndUpdate({ _id: id }, updateProductDto, { new: true })
        .exec();
      if (!updatedProduct) {
        throw new NotFoundException(`Product with id '${id}' not found`);
      }
      return updatedProduct;
    } catch (error) {
      // Handle specific errors or rethrow for general handling
      throw new Error(
        `Could not update product with id '${id}': ${error.message}`,
      );
    }
  }

  async remove(id: string): Promise<Product> {
    try {
      const deletedProduct = await this.productModel
        .findByIdAndDelete({ _id: id })
        .exec();
      if (!deletedProduct) {
        throw new NotFoundException(`Product with id '${id}' not found`);
      }
      return deletedProduct;
    } catch (error) {
      // Handle specific errors or rethrow for general handling
      throw new Error(
        `Could not delete product with id '${id}': ${error.message}`,
      );
    }
  }
}
