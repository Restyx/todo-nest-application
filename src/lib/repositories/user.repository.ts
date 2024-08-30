import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from 'src/lib/entities/user.entity';
import { UserReposityInterface } from 'src/lib/interfaces/user.repository.interface';
import { BaseAbstractRepository } from './base/base.abstract.repository';

@Injectable()
export class UserRepository
  extends BaseAbstractRepository<UserEntity>
  implements UserReposityInterface
{
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }
}
