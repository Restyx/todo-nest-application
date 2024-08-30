import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { compare } from 'bcryptjs';

import { UserEntity } from 'src/lib/entities/user.entity';
import { AccessTokenDto } from './dto/access-token.dto';
import { AuthServiceInterface } from './interfaces/auth.service.inteface';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<UserEntity | null> {
    const user = await this.userService.getByEmail(email);

    if (user && (await compare(pass, user.password))) {
      delete user.password;
      return user;
    }

    return null;
  }

  async login(user: UserEntity): Promise<AccessTokenDto> {
    const payload = {
      sub: user.id,
      email: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
