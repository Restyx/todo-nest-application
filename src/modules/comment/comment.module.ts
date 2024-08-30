import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentEntity } from 'src/lib/entities/comment.entity';
import { CommentRepository } from 'src/lib/repositories/comment.repository';
import { CaslAbilityFactory } from 'src/lib/providers/casl-ability.factory';

import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { BoardModule } from '../board/board.module';
import { ListModule } from '../list/list.module';
import { CardModule } from '../card/card.module';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity]), BoardModule, ListModule, CardModule],
  controllers: [CommentController],
  providers: [
    CommentService,
    CaslAbilityFactory,
    {
      provide: 'CommentReposityInterface',
      useClass: CommentRepository,
    },
  ],
  exports: [CommentService],
})
export class CommentModule {}
