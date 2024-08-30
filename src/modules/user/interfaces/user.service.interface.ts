import { UserEntity } from 'src/lib/entities/user.entity';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export interface UserServiceInterface {
  create(data: CreateUserDto): Promise<UserEntity>;
  getById(id: number): Promise<UserEntity>;
  getByEmail(email: string): Promise<UserEntity>;
  update(id: number, data: UpdateUserDto): Promise<UserEntity>;
  removeById(id: number): Promise<UserEntity>;

  checMissingUsers(userIds: number[]): Promise<number[]>;
}
