import { List } from '../../list/entities/list.entity';
import { Project } from '../../project/entities/project.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Task } from '../../task/entities/task.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Project, (project) => project.owner)
  projects: Project[];

  @OneToMany(() => List, (list) => list.owner)
  lists: List[];

  @OneToMany(() => Task, (task) => task.owner)
  tasks: Task[];
}
