import { ApiProperty } from '@nestjs/swagger';
import { Content } from '../../bin/entities/Content.abstract';
import { List } from '../../list/entities/list.entity';
import { Entity, Column, OneToMany, CreateDateColumn } from 'typeorm';

@Entity('projects')
export class Project extends Content {
  @ApiProperty({ description: 'Описание проекта' })
  @Column()
  description: string;

  @ApiProperty({ description: 'Дата и время создания проекта' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // @ApiProperty({
  //   description: 'Списки задач принадлежащие объекту',
  //   type: [List],
  // })
  @OneToMany(() => List, (list) => list.project, { onDelete: 'CASCADE' })
  lists: List[];
}
