import { ApiHideProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BoardEntity } from './board.entity';
import { CardEntity } from './card.entity';

@Entity('lists')
export class ListEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'board_id' })
  boardId: number;

  @ApiHideProperty()
  @ManyToOne(() => BoardEntity, (board) => board.lists, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'board_id' })
  board: BoardEntity;

  @OneToMany(() => CardEntity, (card) => card.list)
  cards: CardEntity[];

  @Column()
  name: string;

  @Column()
  position: number;
}
