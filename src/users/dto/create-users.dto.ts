import { ApiProperty } from '@nestjs/swagger';

export class CreateUsersDto {
  @ApiProperty({
    example: 'test',
    description: 'The name of the user',
  })
  username: string;

  @ApiProperty({
    example: '123',
    description: 'The password of the user',
  })
  password: string;
}
