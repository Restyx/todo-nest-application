import { ApiHideProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from './user.entity';
import { ListEntity } from './list.entity';

@Entity('boards')
export class BoardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @ApiHideProperty()
  @ManyToOne(() => UserEntity, (user) => user.boards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToMany(() => UserEntity)
  @JoinTable({ name: 'board_member' })
  boardMembers: UserEntity[] | number[];

  @OneToMany(() => ListEntity, (list) => list.board)
  lists: ListEntity[] | number[];

  @Column()
  name: string;

  @Column({ name: 'is_public' })
  isPublic: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
