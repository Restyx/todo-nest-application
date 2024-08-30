import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { CardEntity } from 'src/lib/entities/card.entity';
import { CardReposityInterface } from 'src/lib/interfaces/card.repository.interface';
import { BaseAbstractRepository } from './base/base.abstract.repository';

@Injectable()
export class CardRepository
  extends BaseAbstractRepository<CardEntity>
  implements CardReposityInterface
{
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
  ) {
    super(cardRepository);
  }

  public async addMember(cardId: number, memberId: number[]): Promise<void> {
    await this.cardRepository
      .createQueryBuilder()
      .relation(CardEntity, 'cardMembers')
      .of(cardId)
      .add(memberId);
  }

  public async removeMember(cardId: number, memberId: number[]): Promise<void> {
    await this.cardRepository
      .createQueryBuilder()
      .relation(CardEntity, 'cardMembers')
      .of(cardId)
      .remove(memberId);
  }

  public async updatePositions(
    card: DeepPartial<CardEntity>,
    destination: DeepPartial<CardEntity>,
  ): Promise<void> {
    await this.cardRepository
      .createQueryBuilder()
      .update()
      .set({ position: () => 'position - 1' })
      .where('position > :cardPosition', { cardPosition: card.position })
      .andWhere('list_id = :listId', { listId: card.listId })
      .execute();

    if (destination !== undefined && destination !== null) {
      await this.cardRepository
        .createQueryBuilder()
        .update()
        .set({
          position: () => 'position + 1',
        })
        .where('position >= :destination', {
          destination: destination.position,
        })
        .andWhere('list_id = :listId', {
          listId: destination.listId || card.listId,
        })
        .execute();
    }
  }
}
