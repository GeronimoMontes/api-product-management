import { ApiProperty } from '@nestjs/swagger';
export class UpdateProductDto {
  @ApiProperty({ example: 'Updated product name', description: 'The updated name of the product', required: false})
  name?: string;
  
  @ApiProperty({ example: 'An updated description of the product', description: 'The updated description of the product', required: false })
  description?: string;

  @ApiProperty({ example: 150, description: 'The updated price of the product', required: false })
  price?: number;
}
