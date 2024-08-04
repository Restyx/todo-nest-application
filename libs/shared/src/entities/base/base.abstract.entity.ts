import { PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

export abstract class BaseAbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, select: false })
  ownerId: number;

  @Column()
  title: string;
}
