import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { BoardEntity } from 'src/lib/entities/board.entity';
import { BoardRepositoryInterface } from 'src/lib/interfaces/board.repository.interface';

import { CreateBoardDto } from './dto/create-board.dto';
import { BoardServiceInterface } from './interfaces/board.service.interface';
import { UserService } from '../user/user.service';

@Injectable()
export class BoardService implements BoardServiceInterface {
  constructor(
    @Inject('BoardReposityInterface')
    private readonly boardRepository: BoardRepositoryInterface,
    private readonly userService: UserService,
  ) {}

  async create(userId: number, data: CreateBoardDto): Promise<BoardEntity> {
    const board = this.boardRepository.create({
      user: { id: userId },
      ...data,
    });
    return this.boardRepository.save(board);
  }

  getById(id: number): Promise<BoardEntity> {
    return this.boardRepository.findByCondition({
      where: { id },
      loadRelationIds: { relations: ['boardMembers'] },
      relations: { lists: { cards: true } },
    });
  }

  async getByUser(userId: number): Promise<BoardEntity[]> {
    return await this.boardRepository.findAll({
      where: { userId },
    });
  }

  async update(board: BoardEntity): Promise<BoardEntity> {
    return this.boardRepository.save(board);
  }

  async removeById(board: BoardEntity): Promise<BoardEntity> {
    return this.boardRepository.remove(board);
  }

  async addMember(boardId: number, memberId: number[]): Promise<void> {
    const missingUsersids = await this.userService.checMissingUsers(memberId);
    if (missingUsersids.length > 0) {
      throw new BadRequestException(
        `users with IDs (${missingUsersids.toString()}) do not exist`,
      );
    }
    await this.boardRepository.addMember(boardId, memberId);
  }

  async removeMember(boardId: number, memberId: number[]): Promise<void> {
    await this.boardRepository.removeMember(boardId, memberId);
  }
}
