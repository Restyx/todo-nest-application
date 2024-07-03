import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { compare, hash } from 'bcryptjs';
import { User } from '../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { LoggedUserDto } from './dto/logged-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(Dto: CreateUserDto): Promise<{ access_token: string }> {
    const { username, password } = Dto;
    const salt = this.configService.get<number>('bcrypt.salt');
    const hashedPassword = await hash(password, salt);
    const user: User = await this.userService.createUser({
      username,
      password: hashedPassword,
    });

    return await this.login(user);
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user: User = await this.userService.getUserByName(username);

    if (user && (await compare(pass, user.password))) {
      delete user.password;
      return user;
    }
    return null;
  }

  async login(user: LoggedUserDto): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
