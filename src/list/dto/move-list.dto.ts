import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class MoveListDto {
  @ApiProperty({
    description: 'Идентификатор проекта в который переноситься список задач',
  })
  @IsNotEmpty()
  @IsNumber()
  readonly projectId: number;

  @ApiProperty({
    description: 'Позиция в проекте куда переносится список задач',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly position: number;
}
