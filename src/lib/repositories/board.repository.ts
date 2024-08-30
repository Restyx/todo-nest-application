import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BoardEntity } from 'src/lib/entities/board.entity';
import { BoardRepositoryInterface } from 'src/lib/interfaces/board.repository.interface';
import { BaseAbstractRepository } from './base/base.abstract.repository';

@Injectable()
export class BoardRepository
  extends BaseAbstractRepository<BoardEntity>
  implements BoardRepositoryInterface
{
  constructor(
    @InjectRepository(BoardEntity)
    private readonly boardRepository: Repository<BoardEntity>,
  ) {
    super(boardRepository);
  }

  public async addMember(boardId: number, memberId: number[]): Promise<void> {
    await this.boardRepository
      .createQueryBuilder()
      .relation(BoardEntity, 'boardMembers')
      .of(boardId)
      .add(memberId);
  }

  public async removeMember(
    boardId: number,
    memberId: number[],
  ): Promise<void> {
    await this.boardRepository
      .createQueryBuilder()
      .relation(BoardEntity, 'boardMembers')
      .of(boardId)
      .remove(memberId);
  }
}
