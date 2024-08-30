import { Inject, Injectable } from '@nestjs/common';

import { CommentEntity } from 'src/lib/entities/comment.entity';
import { CommentReposityInterface } from 'src/lib/interfaces/comment.repository.interface';

import { CommentServiceInterface } from './interfaces/comment.service.interface';
import { CreateCommentDto } from './dto/create-comment.dot';

@Injectable()
export class CommentService implements CommentServiceInterface {
  constructor(
    @Inject('CommentReposityInterface')
    private readonly commentRepository: CommentReposityInterface,
  ) {}

  async create(
    userId: number,
    cardId: number,
    data: CreateCommentDto,
  ): Promise<CommentEntity> {
    return await this.commentRepository.save({
      userId,
      cardId,
      ...data,
    });
  }
  async getByCard(cardId: number): Promise<CommentEntity[]> {
    return await this.commentRepository.findAll({ where: { cardId } });
  }
  async getById(commentId: number): Promise<CommentEntity> {
    return await this.commentRepository.findOneById(commentId);
  }
  async update(comment: CommentEntity): Promise<CommentEntity> {
    delete comment.card;
    return this.commentRepository.save(comment);
  }
  async remove(comment: CommentEntity): Promise<CommentEntity> {
    delete comment.card;
    return this.commentRepository.remove(comment);
  }
}
