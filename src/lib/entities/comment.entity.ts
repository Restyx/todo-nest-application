import { ApiHideProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from './user.entity';
import { CardEntity } from './card.entity';

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'card_id', nullable: true })
  cardId: number;
  
  @ApiHideProperty()
  @ManyToOne(() => CardEntity, (card) => card.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'card_id' })
  card: CardEntity;

  @Column()
  comment: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
