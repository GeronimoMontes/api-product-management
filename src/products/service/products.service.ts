import { Injectable } from '@nestjs/common';
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

  create(createProductDto: CreateProductDto): Promise<Product> {
    const createProduct = this.productModel.create(createProductDto);
    return createProduct;
  }

  async findAll(limit, skip, search = ''): Promise<any> {
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
  }

  async isNameTaken(name: string): Promise<boolean> {
    const data = await this.productModel.find({ name }).exec();
    return data.length > 0;
  }

  findOne(id: string): Promise<Product> {
    return this.productModel.findOne({ _id: id }).exec();
  }

  update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    return this.productModel
      .findOneAndUpdate({ _id: id }, updateProductDto)
      .exec();
  }

  remove(id: string): Promise<Product> {
    return this.productModel.findByIdAndDelete({ _id: id }).exec();
  }
}
