import { AppAbility } from 'src/lib/providers/casl-ability.factory';

export interface PolicyHandlerInterface {
  handle(ability: AppAbility): boolean;
}
