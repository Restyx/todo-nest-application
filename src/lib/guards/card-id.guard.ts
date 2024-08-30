import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CardService } from 'src/modules/card/card.service';
import {
  Action,
  CaslAbilityFactory,
} from 'src/lib/providers/casl-ability.factory';
import { ACTION_KEY } from 'src/lib/decorators/action.decorator';
import { ListEntity } from 'src/lib/entities/list.entity';

@Injectable()
export class CardIdGuard implements CanActivate {
  constructor(
    private readonly cardService: CardService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { list }: { list: ListEntity } = request;
    const { cardId }: { cardId: string } = request.params;

    const card = await this.cardService.getById(+cardId);
    if (!card) throw new NotFoundException(`card ${cardId} not found`);

    card.list = list;

    request['card'] = card;

    const ability = this.caslAbilityFactory.createForUser(request['user']);
    const action =
      this.reflector.get<Action>(ACTION_KEY, context.getHandler()) ||
      Action.Read;

    return ability.can(action, request['card']);
  }
}
