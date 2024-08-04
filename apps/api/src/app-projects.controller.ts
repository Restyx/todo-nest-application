import {
  AuthGuard,
  CreateListDto,
  CreateProjectDto,
  CreateTaskDto,
  List,
  MoveListDto,
  MoveTaskDto,
  Project,
  Task,
  UpdateListDto,
  UpdateProjectDto,
  UpdateTaskDto,
} from '@app/shared';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiTags('projects')
@ApiHeader({
  name: 'Authorization',
  description: 'Токен авторизации',
  example:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNlcmVuZV91c2VybmFtZTMiLCJzdWIiOjMsImlhdCI6MTcxOTg0OTM4NiwiZXhwIjoxNzE5OTM1Nzg2fQ.FyyaHf_qd6zcog_65pjeWE_fJu8aw6FWfyzn_fHYjfs',
})
@ApiUnauthorizedResponse({ description: 'Невалидный Bearer токен' })
@Controller('projects')
export class AppProjectsController {
  constructor(
    @Inject('PROJECT_READ_SERVICE')
    private readonly projectsReadService: ClientProxy,
    @Inject('PROJECT_WRITE_SERVICE')
    private readonly projectsWriteService: ClientProxy,
  ) {}

  // create
  @Post('project')
  @ApiCreatedResponse({
    description: 'Проект добавлен в очередь на создание',
  })
  createProject(@Body() data: CreateProjectDto, @Request() { user }) {
    const record = new RmqRecordBuilder(data)
      .setOptions({
        headers: {
          ['user']: user,
        },
      })
      .build();

    return this.projectsWriteService.emit('create-project', record);
  }

  @ApiCreatedResponse({
    description: 'Лист добавлен в очередь на создание',
  })
  @Post('list')
  createList(@Body() data: CreateListDto, @Request() { user }) {
    const record = new RmqRecordBuilder(data)
      .setOptions({
        headers: {
          ['user']: user,
        },
      })
      .build();

    return this.projectsWriteService.emit('create-list', record);
  }

  @ApiCreatedResponse({
    description: 'Задача добавлена в очередь на создание',
  })
  @Post('task')
  createTask(@Body() data: CreateTaskDto, @Request() { user }) {
    const record = new RmqRecordBuilder(data)
      .setOptions({
        headers: {
          ['user']: user,
        },
      })
      .build();

    return this.projectsWriteService.emit('create-task', record);
  }

  // update
  @ApiCreatedResponse({
    description: 'Проект добавлен в очередь на изменение',
  })
  @ApiNotFoundResponse({
    description: 'Проект с указанным id принадлежащий пользователю не найден',
  })
  @Patch('project/:id')
  updateProject(
    @Param('id') id: number,
    @Body() data: UpdateProjectDto,
    @Request() { user },
  ) {
    const record = new RmqRecordBuilder({ id: +id, data })
      .setOptions({
        headers: {
          ['user']: user,
        },
      })
      .build();

    return this.projectsWriteService.emit('update-project', record);
  }
  @ApiCreatedResponse({
    description: 'Лист добавлен в очередь на изменение',
  })
  @ApiNotFoundResponse({
    description: 'Лист с указанным id принадлежащий пользователю не найден',
  })
  @Patch('list/:id')
  updateList(
    @Param('id') id: number,
    @Body() data: UpdateListDto,
    @Request() { user },
  ) {
    const record = new RmqRecordBuilder({ id: +id, data })
      .setOptions({
        headers: {
          ['user']: user,
        },
      })
      .build();

    return this.projectsWriteService.emit('update-list', record);
  }

  @ApiCreatedResponse({
    description: 'Задача добавлена в очередь на изменение',
  })
  @ApiNotFoundResponse({
    description: 'Задача с указанным id принадлежащая пользователю не найдена',
  })
  @Patch('task/:id')
  updateTask(
    @Param('id') id: number,
    @Body() data: UpdateTaskDto,
    @Request() { user },
  ) {
    const record = new RmqRecordBuilder({ id: +id, data })
      .setOptions({
        headers: {
          ['user']: user,
        },
      })
      .build();

    return this.projectsWriteService.emit('update-task', record);
  }

  // delete
  @ApiCreatedResponse({
    description: 'Проект добавлен в очередь на удаление',
  })
  @ApiNotFoundResponse({
    description: 'Проект с указанным id принадлежащий пользователю не найден',
  })
  @Delete('project/:id')
  deleteProject(@Param('id') id: number, @Request() { user }) {
    const record = new RmqRecordBuilder({ id: +id })
      .setOptions({
        headers: {
          ['user']: user,
        },
      })
      .build();

    return this.projectsWriteService.emit('delete-project', record);
  }

  @ApiCreatedResponse({
    description: 'Лист добавлен в очередь на удаление',
  })
  @ApiNotFoundResponse({
    description: 'Лист с указанным id принадлежащий пользователю не найден',
  })
  @Delete('list/:id')
  deleteList(@Param('id') id: number, @Request() { user }) {
    const record = new RmqRecordBuilder({ id: +id })
      .setOptions({
        headers: {
          ['user']: user,
        },
      })
      .build();

    return this.projectsWriteService.emit('delete-list', record);
  }

  @ApiCreatedResponse({
    description: 'Задача добавлена в очередь на удаление',
  })
  @ApiNotFoundResponse({
    description: 'Задача с указанным id принадлежащая пользователю не найдена',
  })
  @Delete('task/:id')
  deleteTask(@Param('id') id: number, @Request() { user }) {
    const record = new RmqRecordBuilder({ id: +id })
      .setOptions({
        headers: {
          ['user']: user,
        },
      })
      .build();

    return this.projectsWriteService.emit('delete-task', record);
  }

  // move
  @ApiOkResponse({ description: 'Список задач успешно передвинут' })
  @ApiNotFoundResponse({
    description:
      'Список задач или Проект с указанным id принадлежащий пользователю не найден',
  })
  @Put('list/move')
  moveList(@Body() data: MoveListDto, @Request() { user }) {
    const record = new RmqRecordBuilder(data)
      .setOptions({
        headers: {
          ['user']: user,
        },
      })
      .build();

    return this.projectsWriteService.emit('move-list', record);
  }

  @ApiOkResponse({ description: 'Задача успешно передвинута' })
  @ApiNotFoundResponse({
    description:
      'Задача или список задач с указанным id принадлежащий пользователю не найден',
  })
  @Put('task/move')
  moveTask(@Body() data: MoveTaskDto, @Request() { user }) {
    const record = new RmqRecordBuilder(data)
      .setOptions({
        headers: {
          ['user']: user,
        },
      })
      .build();

    return this.projectsWriteService.emit('move-task', record);
  }

  // get one
  @ApiOkResponse({ description: 'Проект найдена', type: Project })
  @ApiNotFoundResponse({
    description: 'Проект с указанным id принадлежащий пользователю не найден',
  })
  @Get('project/:id')
  getProject(@Param('id') id: number, @Request() { user }) {
    const record = new RmqRecordBuilder({ id: +id })
      .setOptions({
        headers: {
          ['user']: user,
        },
      })
      .build();

    return this.projectsReadService.send({ msg: 'get-project' }, record);
  }

  @ApiOkResponse({ description: 'Список задач найдена', type: List })
  @ApiNotFoundResponse({
    description:
      'Список задач с указанным id принадлежащий пользователю не найден',
  })
  @Get('list/:id')
  getlist(@Param('id') id: number, @Request() { user }) {
    const record = new RmqRecordBuilder({ id: +id })
      .setOptions({
        headers: {
          ['user']: user,
        },
      })
      .build();

    return this.projectsReadService.send({ msg: 'get-list' }, record);
  }

  @ApiOkResponse({ description: 'задача найдена', type: Task })
  @ApiNotFoundResponse({
    description: 'Задача с указанным id принадлежащая пользователю не найдена',
  })
  @Get('task/:id')
  gettask(@Param('id') id: number, @Request() { user }) {
    const record = new RmqRecordBuilder({ id: +id })
      .setOptions({
        headers: {
          ['user']: user,
        },
      })
      .build();

    return this.projectsReadService.send({ msg: 'get-task' }, record);
  }

  // get all
  @ApiOkResponse({ description: 'Проекты найдены', type: [Project] })
  @Get('project')
  getProjects(@Request() { user }) {
    const record = new RmqRecordBuilder({})
      .setOptions({
        headers: {
          ['user']: user,
        },
      })
      .build();

    return this.projectsReadService.send({ msg: 'get-projects' }, record);
  }
  @ApiOkResponse({ description: 'Листы задач найдены', type: [List] })
  @Get('list')
  getlists(@Request() { user }) {
    const record = new RmqRecordBuilder({})
      .setOptions({
        headers: {
          ['user']: user,
        },
      })
      .build();

    return this.projectsReadService.send({ msg: 'get-lists' }, record);
  }

  @ApiOkResponse({ description: 'Задачи найдены', type: [Task] })
  @Get('task')
  gettasks(@Request() { user }) {
    const record = new RmqRecordBuilder({})
      .setOptions({
        headers: {
          ['user']: user,
        },
      })
      .build();

    return this.projectsReadService.send({ msg: 'get-tasks' }, record);
  }
}
