import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { CardEntity } from 'src/lib/entities/card.entity';
import { ListEntity } from 'src/lib/entities/list.entity';
import { CardReposityInterface } from 'src/lib/interfaces/card.repository.interface';

import { CardServiceInterface } from './intefaces/card.service.interface';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class CardService implements CardServiceInterface {
  constructor(
    @Inject('CardReposityInterface')
    private readonly cardRepository: CardReposityInterface,
    private readonly userService: UserService,
  ) {}

  async create(list: ListEntity, data: CreateCardDto): Promise<CardEntity> {
    const lastPosition = list.cards.length;

    return await this.cardRepository.save({
      listId: list.id,
      position: lastPosition,
      ...data,
    });
  }

  async getByList(listId: number): Promise<CardEntity[]> {
    return this.cardRepository.findAll({
      where: { listId },
      order: { position: 'ASC' },
    });
  }

  async getById(cardId: number): Promise<CardEntity> {
    return await this.cardRepository.findByCondition({
      where: { id: cardId },
      loadRelationIds: {relations: ['cardMembers']},
      relations: { comments: true },
    });
  }

  async update(card: CardEntity, data: UpdateCardDto): Promise<CardEntity> {
    if (data.position !== undefined && data.position !== null) {
      const list = card.list;
      data.position = Math.min(data.position, list.cards.length - 1);
      await this.cardRepository.updatePositions(card, data);
    }

    delete card.list;

    return await this.cardRepository.save({ ...card, ...data });
  }

  async remove(card: CardEntity): Promise<CardEntity> {
    delete card.list;
    await this.cardRepository.updatePositions(card, null);
    return await this.cardRepository.remove(card);
  }

  async addMember(boardId: number, memberId: number[]): Promise<void> {
    const missingUsersids = await this.userService.checMissingUsers(memberId);
    if (missingUsersids.length > 0) {
      throw new BadRequestException(
        `users with IDs (${missingUsersids.toString()}) do not exist`,
      );
    }
    await this.cardRepository.addMember(boardId, memberId);
  }

  async removeMember(boardId: number, memberId: number[]): Promise<void> {
    await this.cardRepository.removeMember(boardId, memberId);
  }
}
