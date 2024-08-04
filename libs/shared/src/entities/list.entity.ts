import { Project } from './project.entity';
import { Task } from './task.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseAbstractEntity } from './base/base.abstract.entity';

@Entity('lists')
export class List extends BaseAbstractEntity {
  @Column({ nullable: true, select: false })
  projectId: number;

  @ManyToOne(() => Project, (project) => project.lists)
  project: Project;

  @Column()
  position: number;

  @OneToMany(() => Task, (task) => task.list, { onDelete: 'CASCADE' })
  tasks: Task[];
}
