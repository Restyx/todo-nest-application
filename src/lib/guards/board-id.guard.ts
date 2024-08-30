import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { BoardService } from 'src/modules/board/board.service';
import {
  Action,
  CaslAbilityFactory,
} from 'src/lib/providers/casl-ability.factory';
import { ACTION_KEY } from 'src/lib/decorators/action.decorator';

@Injectable()
export class BoardIdGuard implements CanActivate {
  constructor(
    private readonly boardService: BoardService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { boardId }: { boardId: string } = request.params;

    const board = await this.boardService.getById(+boardId);
    if (!board) throw new NotFoundException(`board ${boardId} not found`);

    request['board'] = board;

    const ability = this.caslAbilityFactory.createForUser(request['user']);

    const action =
      this.reflector.get<Action>(ACTION_KEY, context.getHandler()) ||
      Action.Read;

    return ability.can(action, request['board']);
  }
}
