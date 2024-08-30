import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
