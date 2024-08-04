import { List } from './list.entity';
import { Entity, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { BaseAbstractEntity } from './base/base.abstract.entity';

@Entity('tasks')
export class Task extends BaseAbstractEntity {
  @Column({ nullable: true, select: false })
  listId: number;

  @ManyToOne(() => List, (list) => list.tasks)
  list: List;

  @Column()
  position: number;

  @Column()
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
