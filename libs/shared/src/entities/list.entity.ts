import { Project } from './project.entity';
import { Task } from './task.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseAbstractEntity } from './base/base.abstract.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('lists')
export class List extends BaseAbstractEntity {
  @ApiProperty({
    description: 'Идентификатор проекта которому принадлежит список задач',
  })
  @Column({ nullable: true, select: false })
  projectId: number;

  @ManyToOne(() => Project, (project) => project.lists)
  project: Project;

  @ApiProperty({ description: 'Позиция списка задач в проекте' })
  @Column()
  position: number;

  @ApiProperty({ description: 'Задачи принадлежащие списку', type: [Task] })
  @OneToMany(() => Task, (task) => task.list, { onDelete: 'CASCADE' })
  tasks: Task[];
}
