import { DeepPartial } from 'typeorm';
import { CardEntity } from 'src/lib/entities/card.entity';
import { BaseInterfaceRepository } from 'src/lib/repositories/base/base.interface.repository';

export interface CardReposityInterface
  extends BaseInterfaceRepository<CardEntity> {
  addMember(cardId: number, memberId: number[]): Promise<void>;
  removeMember(cardId: number, memberId: number[]): Promise<void>;
  updatePositions(
    card: DeepPartial<CardEntity>,
    destination: DeepPartial<CardEntity>,
  ): Promise<void>;
}
