import { ApiHideProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

import { BoardEntity } from './board.entity';
import { CommentEntity } from './comment.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiHideProperty()
  @OneToMany(() => BoardEntity, (board) => board.user)
  boards: BoardEntity[];

  @ApiHideProperty()
  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];

  @Column({ unique: true })
  email: string;

  @ApiHideProperty()
  @Column({ select: false })
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
