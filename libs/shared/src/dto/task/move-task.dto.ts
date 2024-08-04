import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class MoveTaskDto {
  @ApiProperty({
    description: 'идентификатор задачи для перемещения',
  })
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;

  @ApiProperty({
    description: 'Идентификатор списка задач в который переноситься задача',
  })
  @IsNotEmpty()
  @IsNumber()
  readonly listId: number;

  @ApiProperty({
    description: 'позиция в списке задач куда переноситься задача',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly position: number;
}
