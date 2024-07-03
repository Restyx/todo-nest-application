import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const queryResult = await this.userRepository
      .createQueryBuilder('users')
      .insert()
      .values(createUserDto)
      .returning('*')
      .execute()
      .catch(() => {
        throw new HttpException(
          'username already in use',
          HttpStatus.BAD_REQUEST,
        );
      });

    return this.userRepository.create(queryResult.raw[0] as object);
  }

  async getAll(): Promise<User[]> {
    return await this.userRepository.createQueryBuilder('users').getMany();
  }

  async getUserById(id: number): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('users')
      .where('user.id = :id', { id })
      .getOneOrFail()
      .catch(() => {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      });
  }

  async getUserByName(username: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('users')
      .where('users.username = :username', { username })
      .getOneOrFail()
      .catch(() => {
        throw new HttpException('username not found', HttpStatus.NOT_FOUND);
      });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository
      .createQueryBuilder('users')
      .delete()
      .where('users.id = :id', { id })
      .execute();
  }
}
