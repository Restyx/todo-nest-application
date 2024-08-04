import { Controller } from '@nestjs/common';
import { ProjectService } from './project.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { SharedService, CreateProjectDto, UpdateProjectDto } from '@app/shared';

@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly sharedService: SharedService,
  ) {}

  @EventPattern('create-project')
  create(
    @Ctx() context: RmqContext,
    @Payload() createProjectDto: CreateProjectDto,
  ) {
    this.sharedService.acknowledgeMessage(context);
    const { sub } = this.sharedService.getUserFromHeader(context);

    return this.projectService.create(sub, createProjectDto);
  }

  @EventPattern('update-project')
  update(
    @Ctx() context: RmqContext,
    @Payload('id') id: number,
    @Payload('data') updateProjectDto: UpdateProjectDto,
  ) {
    this.sharedService.acknowledgeMessage(context);
    const { sub } = this.sharedService.getUserFromHeader(context);

    return this.projectService.update(sub, id, updateProjectDto);
  }

  @EventPattern('delete-project')
  remove(@Ctx() context: RmqContext, @Payload('id') id: number) {
    this.sharedService.acknowledgeMessage(context);
    const { sub } = this.sharedService.getUserFromHeader(context);

    return this.projectService.remove(sub, id);
  }

  @MessagePattern({ msg: 'get-project' })
  findOne(@Ctx() context: RmqContext, @Payload('id') id: number) {
    this.sharedService.acknowledgeMessage(context);
    const { sub } = this.sharedService.getUserFromHeader(context);

    return this.projectService.findOne(sub, id);
  }

  @MessagePattern({ msg: 'get-projects' })
  findAll(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);
    const { sub } = this.sharedService.getUserFromHeader(context);

    return this.projectService.findAll(sub);
  }
}
