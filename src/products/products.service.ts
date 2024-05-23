import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { products } from './data';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private dataProducts: Product[] = products;

  create(createProductDto: CreateProductDto) {
    this.dataProducts.push(createProductDto);
    return this.dataProducts;
  }

  findAll() {
    return this.dataProducts;
  }

  findOne(id: number) {
    return this.dataProducts.find(element => element.id == id);
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    const { name, description, price } = updateProductDto;
    this.dataProducts = this.dataProducts.map((element, index, arr) => {
      element = { id, name, description, price };
      return element;
    });
    return this.dataProducts[id];
  }

  remove(id: number) {
    this.dataProducts = this.dataProducts.filter((element, index, arr) => element.id != id)
    return `This action removes a #${id} product`;
  }
}
