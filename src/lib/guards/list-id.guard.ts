import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ListService } from 'src/modules/list/list.service';
import {
  Action,
  CaslAbilityFactory,
} from 'src/lib/providers/casl-ability.factory';
import { ACTION_KEY } from 'src/lib/decorators/action.decorator';
import { BoardEntity } from 'src/lib/entities/board.entity';

@Injectable()
export class ListIdGuard implements CanActivate {
  constructor(
    private readonly listService: ListService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { board }: { board: BoardEntity } = request;
    const { listId }: { listId: string } = request.params;

    const list = await this.listService.getById(+listId);
    if (!list) throw new NotFoundException(`list ${listId} not found`);

    list.board = board;

    request['list'] = list;

    const ability = this.caslAbilityFactory.createForUser(request['user']);
    const action =
      this.reflector.get<Action>(ACTION_KEY, context.getHandler()) ||
      Action.Read;

    return ability.can(action, request['list']);
  }
}
