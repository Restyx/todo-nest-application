import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Put,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Task } from './entities/task.entity';
import { MoveTaskDto } from './dto/move-task.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('task')
@ApiHeader({
  name: 'Authorization',
  description: 'Токен авторизации',
  example:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNlcmVuZV91c2VybmFtZTMiLCJzdWIiOjMsImlhdCI6MTcxOTg0OTM4NiwiZXhwIjoxNzE5OTM1Nzg2fQ.FyyaHf_qd6zcog_65pjeWE_fJu8aw6FWfyzn_fHYjfs',
})
@ApiUnauthorizedResponse({ description: 'Невалидный Bearer токен' })
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Задача создана',
    type: Task,
  })
  create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(req.user.userId, createTaskDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Задачи найдены', type: [Task] })
  findAll(@Request() req) {
    return this.taskService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Задача найдена', type: Task })
  @ApiNotFoundResponse({
    description:
      'Задача или список задач с указанным id принадлежащий пользователю не найден',
  })
  // @ApiForbiddenResponse({ description: 'Задача не принадлежит пользователю' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.taskService.findOne(+id, req.user.userId);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Задача успешно обнавлена', type: Task })
  @ApiNotFoundResponse({
    description:
      'Задача или список задач с указанным id принадлежащий пользователю не найден',
  })
  // @ApiForbiddenResponse({ description: 'Задача не принадлежит пользователю' })
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(+id, req.user.userId, updateTaskDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Задача успешно удалена' })
  @ApiNotFoundResponse({
    description:
      'Задача или список задач с указанным id принадлежащий пользователю не найден',
  })
  // @ApiForbiddenResponse({ description: 'Задача не принадлежит пользователю' })
  remove(@Param('id') id: string, @Request() req) {
    return this.taskService.remove(+id, req.user.userId);
  }

  @Put(':id/move')
  @ApiOkResponse({ description: 'Задача успешно передвинута' })
  @ApiNotFoundResponse({
    description:
      'Задача или список задач с указанным id принадлежащий пользователю не найден',
  })
  // @ApiForbiddenResponse({ description: 'Список задач не принадлежит пользователю' })
  moveTo(
    @Request() req,
    @Param('id') id: number,
    @Body() moveListDto: MoveTaskDto,
  ) {
    return this.taskService.moveTo(req.user.userId, id, moveListDto);
  }
}
