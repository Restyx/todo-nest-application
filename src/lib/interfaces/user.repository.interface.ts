import { UserEntity } from 'src/lib/entities/user.entity';
import { BaseInterfaceRepository } from 'src/lib/repositories/base/base.interface.repository';

export interface UserReposityInterface
  extends BaseInterfaceRepository<UserEntity> {}
