import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

export abstract class Content {
  @ApiProperty({ description: 'Идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Идентификатор пользователя которому принадлежит объект',
  })
  @Column({ nullable: true, select: false })
  ownerId: number;

  @ManyToOne(() => User, (user) => user.projects)
  owner: User;

  @ApiProperty({ description: 'Заголовок' })
  @Column()
  title: string;
}
