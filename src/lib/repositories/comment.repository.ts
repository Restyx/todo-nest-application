import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommentEntity } from 'src/lib/entities/comment.entity';
import { CommentReposityInterface } from 'src/lib/interfaces/comment.repository.interface';
import { BaseAbstractRepository } from './base/base.abstract.repository';

@Injectable()
export class CommentRepository
  extends BaseAbstractRepository<CommentEntity>
  implements CommentReposityInterface
{
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {
    super(commentRepository);
  }
}
