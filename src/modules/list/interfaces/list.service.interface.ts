import { BoardEntity } from 'src/lib/entities/board.entity';
import { ListEntity } from 'src/lib/entities/list.entity';

import { CreateListDto } from '../dto/create-list.dto';
import { UpdateListDto } from '../dto/update-list.dto';

export interface ListServiceInterface {
  create(board: BoardEntity, data: CreateListDto): Promise<ListEntity>;
  getByBoard(boardId: number): Promise<ListEntity[]>;
  getById(listId: number): Promise<ListEntity>;
  update(list: ListEntity, data: UpdateListDto): Promise<ListEntity>;
  remove(list: ListEntity): Promise<ListEntity>;
}
