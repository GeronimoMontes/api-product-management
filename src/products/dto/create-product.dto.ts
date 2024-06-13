import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 'Product name',
    description: 'The name of the product',
  })
  name: string;

  @ApiProperty({ example: 100, description: 'The price of the product' })
  price: number;

  @ApiProperty({
    example: 'A brief description of the product',
    description: 'The description of the product',
  })
  description: string;
}
