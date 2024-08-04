import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
