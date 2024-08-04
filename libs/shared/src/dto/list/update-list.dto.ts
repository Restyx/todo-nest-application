import { PartialType } from '@nestjs/swagger';
import { CreateListDto } from './create-list.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateListDto extends PartialType(CreateListDto) {}
