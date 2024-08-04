import {
  AuthGuard,
  CreateListDto,
  CreateProjectDto,
  CreateTaskDto,
  MoveListDto,
  MoveTaskDto,
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

@UseGuards(AuthGuard)
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
