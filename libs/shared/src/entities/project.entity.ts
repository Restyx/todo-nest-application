import { List } from './list.entity';
import { Entity, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { BaseAbstractEntity } from './base/base.abstract.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('projects')
export class Project extends BaseAbstractEntity {
  @ApiProperty({ description: 'Описание проекта' })
  @Column()
  description: string;

  @ApiProperty({ description: 'Дата и время создания проекта' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Списки задач принадлежащие объекту',
    type: [List],
  })
  @OneToMany(() => List, (list) => list.project, { onDelete: 'CASCADE' })
  lists: List[];
}
