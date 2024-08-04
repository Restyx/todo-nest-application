import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DataSource } from 'typeorm';
import { User } from '@app/shared';
import { ConfigService } from '@nestjs/config';
import { hash, compare } from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(user: CreateUserDto): Promise<User> {
    const { username, password } = user;

    const existingUser = await this.getUserByName(username);
    if (existingUser) {
      throw new ConflictException('username already is use');
    }

    const salt = +this.configService.get<number>('BCRYPT_SALT');
    const hashedPassword = await hash(password, salt);

    const newUser = await this.createUser({
      username,
      password: hashedPassword,
    });

    delete newUser.password;

    return newUser;
  }

  async signIn(loginData: LoginUserDto): Promise<{ access_token: string }> {
    const { username, password } = loginData;
    const user = await this.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      username: user.username,
    };

    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async signOut() {
    return;
  }

  async verifyJwt(jwt: string): Promise<any> {
    return await this.jwtService.verifyAsync(jwt).catch((err) => {
      throw new UnauthorizedException();
    });
  }

  private async createUser(user: CreateUserDto): Promise<User> {
    const queryResult = await this.dataSource
      .getRepository(User)
      .createQueryBuilder()
      .insert()
      .values(user)
      .returning('*')
      .execute();

    return this.dataSource
      .getRepository(User)
      .create(queryResult.raw[0] as object);
  }

  private async getUserByName(username: string): Promise<User | null> {
    return await this.dataSource
      .getRepository(User)
      .createQueryBuilder('users')
      .where('users.username = :username', { username })
      .getOne();
  }

  private async isValidPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await compare(password, hashedPassword);
  }

  private async validateUser(
    username: string,
    password: string,
  ): Promise<User> {
    const userEntity = await this.getUserByName(username);

    const exists = !!userEntity;

    if (!exists) return null;

    const isValidPassword = await this.isValidPassword(
      password,
      userEntity.password,
    );

    if (!isValidPassword) return null;

    return userEntity;
  }
}
