import { PartialType } from '@nestjs/swagger';

import { IsNumber, IsOptional } from 'class-validator';

import { CreateListDto } from './create-list.dto';

export class UpdateListDto extends PartialType(CreateListDto) {
  @IsOptional()
  @IsNumber()
  position?: number;
}
