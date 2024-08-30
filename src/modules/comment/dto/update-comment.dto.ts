import { PartialType } from '@nestjs/swagger';

import { CreateCommentDto } from './create-comment.dot';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {}
