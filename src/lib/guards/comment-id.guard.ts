import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CommentService } from 'src/modules/comment/comment.service';
import {
  Action,
  CaslAbilityFactory,
} from 'src/lib/providers/casl-ability.factory';
import { ACTION_KEY } from 'src/lib/decorators/action.decorator';
import { CardEntity } from 'src/lib/entities/card.entity';

@Injectable()
export class CommentIdGuard implements CanActivate {
  constructor(
    private readonly commentService: CommentService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { card }: { card: CardEntity } = request;
    const { commentId }: { commentId: string } = request.params;

    const comment = await this.commentService.getById(+commentId);
    if (!comment) throw new NotFoundException(`comment ${commentId} not found`);

    comment.card = card;

    request['comment'] = comment;

    const ability = this.caslAbilityFactory.createForUser(request['user']);
    const action =
      this.reflector.get<Action>(ACTION_KEY, context.getHandler()) ||
      Action.Read;

    return ability.can(action, request['card']);
  }
}
