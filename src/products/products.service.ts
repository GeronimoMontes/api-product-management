import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './interfaces/products.interface';

@Injectable()
export class ProductsService {
  constructor(@Inject('PRODUCT_MODEL') private readonly productModel: Model<Product>) { }

  create(createProductDto: CreateProductDto): Promise<Product> {
    const createProduct = this.productModel.create(createProductDto);
    return createProduct;
  }

  findAll(limit, skip): Promise<Product[]> {
    return this.productModel.find().limit(limit).skip(skip).exec();
  }

  findOne(id: number): Promise<Product> {
    return this.productModel.findOne({ "_id": id }).exec();
  }

  update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    return this.productModel.findOneAndUpdate({ "_id": id }, updateProductDto).exec();
  }

  remove(id: number): Promise<Product> {
    return this.productModel.findByIdAndDelete({ "_id": id }).exec();
  }
}
