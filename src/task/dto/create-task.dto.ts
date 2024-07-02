import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Название задачи / дела',
    examples: ['помыть посуду', 'купить шторы', 'выгулять собаку'],
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: 'Описание задачи',
  })
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty({
    description: 'Идентификатор списка задач к которому принадлежит задача',
  })
  @IsNotEmpty()
  @IsNumber()
  readonly listId: number;
}
