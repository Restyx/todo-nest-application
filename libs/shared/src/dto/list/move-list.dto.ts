import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class MoveListDto {
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;

  @IsNotEmpty()
  @IsNumber()
  readonly projectId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly position: number;
}
