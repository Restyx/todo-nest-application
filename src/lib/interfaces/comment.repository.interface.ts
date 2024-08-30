import { CommentEntity } from 'src/lib/entities/comment.entity';
import { BaseInterfaceRepository } from 'src/lib/repositories/base/base.interface.repository';

export interface CommentReposityInterface
  extends BaseInterfaceRepository<CommentEntity> {}
