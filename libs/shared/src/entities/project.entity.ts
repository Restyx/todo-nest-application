import { List } from './list.entity';
import { Entity, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { BaseAbstractEntity } from './base/base.abstract.entity';

@Entity('projects')
export class Project extends BaseAbstractEntity {
  @Column()
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => List, (list) => list.project, { onDelete: 'CASCADE' })
  lists: List[];
}
