import { Injectable } from '@nestjs/common';
import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
  MongoQuery,
} from '@casl/ability';

import { BoardEntity } from 'src/lib/entities/board.entity';
import { CardEntity } from 'src/lib/entities/card.entity';
import { CommentEntity } from 'src/lib/entities/comment.entity';
import { ListEntity } from 'src/lib/entities/list.entity';
import { UserEntity } from 'src/lib/entities/user.entity';

export const enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

type Subjects =
  | InferSubjects<
      | typeof UserEntity
      | typeof BoardEntity
      | typeof ListEntity
      | typeof CardEntity
      | typeof CommentEntity
    >
  | 'all';

type PossibleAbilities = [Action, Subjects];
type Conditions = MongoQuery;

export type AppAbility = MongoAbility<PossibleAbilities, Conditions>;

type FlatList = ListEntity & {
  'board.userId': ListEntity['board']['userId'];
  'board.isPublic': ListEntity['board']['isPublic'];
  'board.boardMembers': ListEntity['board']['boardMembers'];
};

type FlatCard = CardEntity & {
  'list.board.userId': CardEntity['list']['board']['userId'];
  'list.board.boardMembers': CardEntity['list']['board']['boardMembers'];
};

type FlatComment = CommentEntity & {
  'card.cardMembers': CommentEntity['card']['cardMembers'];
  'card.list.board.boardMembers': CommentEntity['card']['list']['board']['boardMembers'];
  'card.list.board.isPublic': CommentEntity['card']['list']['board']['isPublic'];
};

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserEntity) {
    const { can, cannot, build } = new AbilityBuilder(
      createMongoAbility<PossibleAbilities, Conditions>,
    );

    can([Action.Read, Action.Update], UserEntity, { id: user.id });

    can([Action.Manage], BoardEntity, { userId: user.id });
    can([Action.Read], BoardEntity, { isPublic: { $eq: true } });
    can([Action.Read], BoardEntity, {
      boardMembers: { $elemMatch: { $eq: user.id } },
    });

    can<FlatList>([Action.Manage], ListEntity, { 'board.userId': user.id });
    can<FlatList>([Action.Read], ListEntity, {
      'board.isPublic': { $eq: true },
    });
    can<FlatList>([Action.Read], ListEntity, {
      'board.boardMembers': { $elemMatch: { $eq: user.id } },
    });

    can<FlatCard>([Action.Manage], CardEntity, {
      'list.board.userId': user.id,
    });
    can<FlatCard>([Action.Read], CardEntity, {
      'list.board.boardMembers': { $elemMatch: { $eq: user.id } },
    });
    can([Action.Read], CardEntity, {
      cardMembers: { $elemMatch: { $eq: user.id } },
    });

    can(Action.Manage, CommentEntity, { userId: user.id });
    can<FlatComment>(Action.Read, CommentEntity, {
      'card.cardMembers': { $elemMatch: { $eq: user.id } },
    });
    can<FlatComment>(Action.Read, CommentEntity, {
      'card.list.board.isPublic': { $eq: true },
    });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
