import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ServerException } from 'src/http/http-exception';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn({ username, password }: SignInDto) {
    const user = await this.usersService.findOne(username);
    if (user?.password !== password) {
      throw new ServerException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Authentication failed.',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: new Error('User not foud.'),
        },
      );
      // throw new UnauthorizedException();
    }
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
