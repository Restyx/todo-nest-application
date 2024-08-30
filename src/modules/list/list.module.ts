import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ListEntity } from 'src/lib/entities/list.entity';
import { ListRepository } from 'src/lib/repositories/list.repository';
import { CaslAbilityFactory } from 'src/lib/providers/casl-ability.factory';

import { ListService } from './list.service';
import { ListController } from './list.controller';
import { BoardModule } from '../board/board.module';

@Module({
  imports: [TypeOrmModule.forFeature([ListEntity]), BoardModule],
  controllers: [ListController],
  providers: [
    ListService,
    CaslAbilityFactory,
    {
      provide: 'ListReposityInterface',
      useClass: ListRepository,
    },
  ],
  exports: [ListService],
})
export class ListModule {}
