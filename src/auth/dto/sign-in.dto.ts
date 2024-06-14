import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ example: 'test', description: 'Username of the user' })
  username: string;

  @ApiProperty({ example: '123', description: 'Password of the user' })
  password: string;
}
