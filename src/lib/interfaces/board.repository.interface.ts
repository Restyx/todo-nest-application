import { BoardEntity } from 'src/lib/entities/board.entity';
import { BaseInterfaceRepository } from 'src/lib/repositories/base/base.interface.repository';

export interface BoardRepositoryInterface
  extends BaseInterfaceRepository<BoardEntity> {
  addMember(boardId: number, memberId: number[]): Promise<void>;
  removeMember(boardId: number, memberId: number[]): Promise<void>;
}
