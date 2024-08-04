import { List } from './list.entity';
import { Entity, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { BaseAbstractEntity } from './base/base.abstract.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tasks')
export class Task extends BaseAbstractEntity {
  @ApiProperty({
    description: 'Идентификатор списка которому принадлежит задача',
  })
  @Column({ nullable: true, select: false })
  listId: number;

  @ManyToOne(() => List, (list) => list.tasks)
  list: List;

  @ApiProperty({ description: 'Позиция задачи в списке' })
  @Column()
  position: number;

  @ApiProperty({ description: 'Описание задачи' })
  @Column()
  description: string;

  @ApiProperty({ description: 'Дата и время создания задачи' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
