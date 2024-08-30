import { CommentEntity } from 'src/lib/entities/comment.entity';

import { CreateCommentDto } from '../dto/create-comment.dot';

export interface CommentServiceInterface {
  create(
    userId: number,
    cardId: number,
    data: CreateCommentDto,
  ): Promise<CommentEntity>;
  getByCard(cardId: number): Promise<CommentEntity[]>;
  getById(commentId: number): Promise<CommentEntity>;
  update(comment: CommentEntity): Promise<CommentEntity>;
  remove(comment: CommentEntity): Promise<CommentEntity>;
}
