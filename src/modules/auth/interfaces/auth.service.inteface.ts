import { UserEntity } from 'src/lib/entities/user.entity';

import { AccessTokenDto } from '../dto/access-token.dto';

export interface AuthServiceInterface {
  validateUser(email: string, pass: string): Promise<UserEntity | null>;
  login(user: any): Promise<AccessTokenDto>;
}
