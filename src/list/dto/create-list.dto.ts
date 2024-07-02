import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateListDto {
  @ApiProperty({
    description: 'Название списка задач',
    examples: ['В процессе', 'В планах', 'Выполненные'],
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: 'Идентификатор проекта к которому принадлежит список задач',
  })
  @IsNotEmpty()
  @IsNumber()
  readonly projectId: number;
}
