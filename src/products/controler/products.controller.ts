import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from '../service/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBasicAuth,
} from '@nestjs/swagger';
import { PaginateQueryRaw } from '../paginate/paginate';

@ApiBearerAuth('bearer')
@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @ApiOperation({ summary: 'Retrieve all products' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'search', required: false })
  @Get()
  findAll(@Query() { limit, page, search }: PaginateQueryRaw) {
    return this.productsService.findAll({ limit, page, search });
  }

  @ApiOperation({ summary: 'Check if a product name is unique' })
  @ApiQuery({ name: 'name', required: true })
  @Get('name-unique')
  isNameTaken(@Query() { name }) {
    return this.productsService.isNameTaken(name);
  }

  @ApiOperation({ summary: 'Retrieve a product by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the product to retrieve',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the product to update',
  })
  @ApiBody({ type: UpdateProductDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the product to delete',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
