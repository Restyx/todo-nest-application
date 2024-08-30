import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ListEntity } from 'src/lib/entities/list.entity';
import { ListReposityInterface } from 'src/lib/interfaces/list.repository.interface';
import { BaseAbstractRepository } from './base/base.abstract.repository';

@Injectable()
export class ListRepository
  extends BaseAbstractRepository<ListEntity>
  implements ListReposityInterface
{
  constructor(
    @InjectRepository(ListEntity)
    private readonly listRepository: Repository<ListEntity>,
  ) {
    super(listRepository);
  }

  public async updatePositions(
    list: ListEntity,
    destination: number,
  ): Promise<void> {
    let updateResult = await this.listRepository
      .createQueryBuilder()
      .update()
      .set({ position: () => 'position - 1' })
      .where('position > :listPosition', { listPosition: list.position })
      .andWhere('board_id = :boardId', { boardId: list.boardId })
      .execute();

    if (destination !== null) {
      updateResult = await this.listRepository
        .createQueryBuilder()
        .update()
        .set({ position: () => 'position + 1' })
        .where('position >= :destination', { destination })
        .andWhere('board_id = :boardId', { boardId: list.boardId })
        .execute();
    }
  }
}
