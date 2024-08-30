import { BoardEntity } from 'src/lib/entities/board.entity';
import { CreateBoardDto } from '../dto/create-board.dto';

export interface BoardServiceInterface {
  create(userId: number, data: CreateBoardDto): Promise<BoardEntity>;
  getById(userId: number, id: number): Promise<BoardEntity>;
  getByUser(userId: number): Promise<BoardEntity[]>;
  update(Board: BoardEntity): Promise<BoardEntity>;
  removeById(Board: BoardEntity): Promise<BoardEntity>;
  addMember(boardId: number, memberId: number[]): Promise<void>;
  removeMember(boardId: number, memberId: number[]): Promise<void>;
}
