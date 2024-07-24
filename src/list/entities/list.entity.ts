import { ApiProperty } from '@nestjs/swagger';
import { Content } from '../../lib/entities/content.abstract';
import { Project } from '../../project/entities/project.entity';
import { Task } from '../../task/entities/task.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity('lists')
export class List extends Content {
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
