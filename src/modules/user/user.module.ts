import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from 'src/lib/entities/user.entity';
import { UserRepository } from 'src/lib/repositories/user.repository';
import { CaslAbilityFactory } from 'src/lib/providers/casl-ability.factory';

import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), ConfigModule],
  providers: [
    UserService,
    CaslAbilityFactory,
    {
      provide: 'UserReposityInterface',
      useClass: UserRepository,
    },
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
