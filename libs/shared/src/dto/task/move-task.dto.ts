import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class MoveTaskDto {
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;

  @IsNotEmpty()
  @IsNumber()
  readonly listId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly position: number;
}
