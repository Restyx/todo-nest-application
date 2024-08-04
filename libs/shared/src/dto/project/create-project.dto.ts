import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Название проекта',
    example: 'Домашние дела',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: 'Описание проекта',
    example: 'Дела по дому: уборка, посуда, мебель, бельё и т.д.',
  })
  @IsNotEmpty()
  @IsString()
  readonly description: string;
}
