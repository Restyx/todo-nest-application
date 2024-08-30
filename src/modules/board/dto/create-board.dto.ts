import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateBoardDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  readonly name: string;

  @IsOptional()
  @IsBoolean()
  readonly isPublic?: boolean = false;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  readonly members?: number[] = [];
}
