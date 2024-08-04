import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateListDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsNumber()
  readonly projectId: number;
}
