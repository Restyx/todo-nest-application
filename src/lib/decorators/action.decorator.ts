import { SetMetadata } from '@nestjs/common';

import { Action } from '../providers/casl-ability.factory';

export const ACTION_KEY = 'action';

export const SetActionType = (action: Action) =>
  SetMetadata(ACTION_KEY, action);
