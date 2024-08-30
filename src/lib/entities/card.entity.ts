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

import { ListEntity } from './list.entity';
import { CommentEntity } from './comment.entity';
import { UserEntity } from './user.entity';

@Entity('cards')
export class CardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => UserEntity)
  @JoinTable({ name: 'card_member' })
  cardMembers: UserEntity[] | number[];

  @Column({ name: 'list_id', nullable: true })
  listId: number;
  
  @ApiHideProperty()
  @ManyToOne(() => ListEntity, (list) => list.cards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'list_id' })
  list: ListEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.card)
  comments: CommentEntity[];

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  position: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
