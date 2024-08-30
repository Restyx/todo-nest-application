import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CardEntity } from 'src/lib/entities/card.entity';
import { CardRepository } from 'src/lib/repositories/card.repository';
import { CaslAbilityFactory } from 'src/lib/providers/casl-ability.factory';

import { CardService } from './card.service';
import { CardController } from './card.controller';
import { ListModule } from '../list/list.module';
import { BoardModule } from '../board/board.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CardEntity]),
    UserModule,
    BoardModule,
    ListModule,
  ],
  controllers: [CardController],
  providers: [
    CardService,
    CaslAbilityFactory,
    {
      provide: 'CardReposityInterface',
      useClass: CardRepository,
    },
  ],
  exports: [CardService],
})
export class CardModule {}
