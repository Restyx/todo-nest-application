import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column } from 'typeorm';

export abstract class BaseAbstractEntity {
  @ApiProperty({ description: 'Идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Идентификатор пользователя которому принадлежит объект',
  })
  @Column({ nullable: true, select: false })
  ownerId: number;

  @ApiProperty({ description: 'Заголовок' })
  @Column()
  title: string;
}
