import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BoardEntity } from 'src/lib/entities/board.entity';
import { BoardRepository } from 'src/lib/repositories/board.repository';
import { CaslAbilityFactory } from 'src/lib/providers/casl-ability.factory';

import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([BoardEntity]), UserModule],
  controllers: [BoardController],
  providers: [
    BoardService,
    CaslAbilityFactory,
    {
      provide: 'BoardReposityInterface',
      useClass: BoardRepository,
    },
  ],
  exports: [BoardService],
})
export class BoardModule {}
