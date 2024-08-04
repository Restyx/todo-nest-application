import { Controller } from '@nestjs/common';
import { TaskService } from './task.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import {
  SharedService,
  CreateTaskDto,
  UpdateTaskDto,
  MoveTaskDto,
} from '@app/shared';

@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly sharedService: SharedService,
  ) {}

  @EventPattern('create-task')
  create(@Ctx() context: RmqContext, @Payload() createTaskDto: CreateTaskDto) {
    this.sharedService.acknowledgeMessage(context);
    const { sub } = this.sharedService.getUserFromHeader(context);

    return this.taskService.create(sub, createTaskDto);
  }

  @EventPattern('update-task')
  update(
    @Ctx() context: RmqContext,
    @Payload('id') id: number,
    @Payload('data') updateTaskDto: UpdateTaskDto,
  ) {
    this.sharedService.acknowledgeMessage(context);
    const { sub } = this.sharedService.getUserFromHeader(context);

    return this.taskService.update(sub, id, updateTaskDto);
  }

  @EventPattern('delete-task')
  remove(@Ctx() context: RmqContext, @Payload('id') id: number) {
    this.sharedService.acknowledgeMessage(context);
    const { sub } = this.sharedService.getUserFromHeader(context);

    return this.taskService.remove(sub, id);
  }

  @EventPattern('move-task')
  moveTo(@Ctx() context: RmqContext, @Payload() moveListDto: MoveTaskDto) {
    this.sharedService.acknowledgeMessage(context);
    const { sub } = this.sharedService.getUserFromHeader(context);

    return this.taskService.moveTo(sub, moveListDto);
  }

  @MessagePattern({ msg: 'get-task' })
  findOne(@Ctx() context: RmqContext, @Payload('id') id: number) {
    this.sharedService.acknowledgeMessage(context);
    const { sub } = this.sharedService.getUserFromHeader(context);

    console.log(id);

    return this.taskService.findOne(sub, id);
  }

  @MessagePattern({ msg: 'get-tasks' })
  findAll(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);
    const { sub } = this.sharedService.getUserFromHeader(context);

    return this.taskService.findAll(sub);
  }
}
