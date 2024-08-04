import { Controller } from '@nestjs/common';
import { ListService } from './list.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import {
  SharedService,
  CreateListDto,
  UpdateListDto,
  MoveListDto,
} from '@app/shared';

@Controller('list')
export class ListController {
  constructor(
    private readonly listService: ListService,
    private readonly sharedService: SharedService,
  ) {}

  @EventPattern('create-list')
  create(@Ctx() context: RmqContext, @Payload() createListDto: CreateListDto) {
    this.sharedService.acknowledgeMessage(context);
    const { sub } = this.sharedService.getUserFromHeader(context);

    return this.listService.create(sub, createListDto);
  }

  @EventPattern('update-list')
  update(
    @Ctx() context: RmqContext,
    @Payload('id') id: number,
    @Payload('data') updateListDto: UpdateListDto,
  ) {
    this.sharedService.acknowledgeMessage(context);
    const { sub } = this.sharedService.getUserFromHeader(context);

    return this.listService.update(id, sub, updateListDto);
  }

  @EventPattern('delete-list')
  remove(@Ctx() context: RmqContext, @Payload('id') id: number) {
    this.sharedService.acknowledgeMessage(context);
    const { sub } = this.sharedService.getUserFromHeader(context);

    return this.listService.remove(sub, id);
  }

  @EventPattern('move-list')
  moveTo(@Ctx() context: RmqContext, @Payload() moveListDto: MoveListDto) {
    this.sharedService.acknowledgeMessage(context);
    const { sub } = this.sharedService.getUserFromHeader(context);

    return this.listService.moveTo(sub, moveListDto);
  }

  @MessagePattern({ msg: 'get-list' })
  findOne(@Ctx() context: RmqContext, @Payload('id') id: number) {
    this.sharedService.acknowledgeMessage(context);
    const { sub } = this.sharedService.getUserFromHeader(context);

    console.log(id, sub);

    return this.listService.findOne(sub, id);
  }

  @MessagePattern({ msg: 'get-lists' })
  findAll(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);
    const { sub } = this.sharedService.getUserFromHeader(context);

    return this.listService.findAll(sub);
  }
}
