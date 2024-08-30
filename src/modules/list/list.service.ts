import { Inject, Injectable } from '@nestjs/common';

import { ListEntity } from 'src/lib/entities/list.entity';
import { BoardEntity } from 'src/lib/entities/board.entity';
import { ListReposityInterface } from 'src/lib/interfaces/list.repository.interface';

import { ListServiceInterface } from './interfaces/list.service.interface';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

@Injectable()
export class ListService implements ListServiceInterface {
  constructor(
    @Inject('ListReposityInterface')
    private readonly listRepository: ListReposityInterface,
  ) {}

  public async create(
    board: BoardEntity,
    data: CreateListDto,
  ): Promise<ListEntity> {
    const lastPosition = board.lists.length;

    return await this.listRepository.save({
      boardId: board.id,
      position: lastPosition,
      ...data,
    });
  }

  public async getByBoard(boardId: number): Promise<ListEntity[]> {
    return await this.listRepository.findAll({
      where: { boardId },
      order: { position: 'ASC' },
    });
  }

  public async getById(listId: number): Promise<ListEntity> {
    return await this.listRepository.findByCondition({
      where: { id: listId },
      relations: { board: true, cards: true },
    });
  }

  public async update(
    list: ListEntity,
    data: UpdateListDto,
  ): Promise<ListEntity> {
    if (
      data.position != undefined &&
      data.position !== null &&
      list.position !== data.position
    ) {
      const board = list.board;
      data.position = Math.min(data.position, board.lists.length - 1);
      await this.listRepository.updatePositions(list, data.position);
    }

    delete list.board;

    list = Object.assign(list, data);

    return await this.listRepository.save(list);
  }

  public async remove(list: ListEntity): Promise<ListEntity> {
    await this.listRepository.updatePositions(list, null);
    return await this.listRepository.remove(list);
  }
}
