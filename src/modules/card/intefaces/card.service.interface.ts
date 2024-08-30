import { CardEntity } from 'src/lib/entities/card.entity';
import { ListEntity } from 'src/lib/entities/list.entity';

import { CreateCardDto } from '../dto/create-card.dto';
import { UpdateCardDto } from '../dto/update-card.dto';

export interface CardServiceInterface {
  create(list: ListEntity, data: CreateCardDto): Promise<CardEntity>;
  getByList(listId: number): Promise<CardEntity[]>;
  getById(cardId: number): Promise<CardEntity>;
  update(card: CardEntity, data: UpdateCardDto): Promise<CardEntity>;
  remove(card: CardEntity): Promise<CardEntity>;
  addMember(boardId: number, memberId: number[]): Promise<void>;
  removeMember(boardId: number, memberId: number[]): Promise<void>;
}
