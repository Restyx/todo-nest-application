import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { hash } from 'bcryptjs';

import { UserEntity } from 'src/lib/entities/user.entity';
import { UserReposityInterface } from 'src/lib/interfaces/user.repository.interface';

import { UserServiceInterface } from './interfaces/user.service.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindManyOptions, In, QueryFailedError, TypeORMError } from 'typeorm';

@Injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @Inject('UserReposityInterface')
    private readonly userRepository: UserReposityInterface,
    private readonly configService: ConfigService,
  ) {}

  public async create(data: CreateUserDto): Promise<UserEntity> {
    const { email, password } = data;

    const salt = +this.configService.get<number>('BCRYPT_SALT');
    const hashedPassword = await hash(password, salt);
    try {
      const user: UserEntity = await this.userRepository.save({
        email,
        password: hashedPassword,
      });

      delete user.password;

      return user;
    } catch (err) {
      if (err instanceof QueryFailedError) {
        if (err['code'] === '23505') {
          throw new ConflictException('email already exist');
        }
      }
      throw err;
    }
  }

  public async checMissingUsers(userIds: number[]): Promise<number[]> {
    const existingUsers = await this.userRepository.findAll({
      select: { id: true },
      where: { id: In(userIds) },
    });
    if (userIds.length !== existingUsers.length) {
      const difference = existingUsers
        .filter((x) => !userIds.includes(x.id))
        .map((user) => user.id);
      return difference;
    }

    return [];
  }

  public async getById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOneById(id);
  }

  public async getByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findByCondition({
      where: { email },
      select: { id: true, email: true, password: true },
    });
  }

  public async update(id: number, data: UpdateUserDto): Promise<UserEntity> {
    if (data.password) {
      const salt = +this.configService.get<number>('BCRYPT_SALT');
      data.password = await hash(data.password, salt);
    }

    const user = await this.userRepository.save({ id, ...data });

    delete user.password;

    return user;
  }

  public async removeById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.preload({ id });

    return await this.userRepository.remove(user);
  }
}
