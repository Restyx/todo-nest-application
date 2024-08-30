import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiParam,
  ApiOperation,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { BoardIdGuard } from 'src/lib/guards/board-id.guard';
import { ListIdGuard } from 'src/lib/guards/list-id.guard';
import { UserIdGuard } from 'src/lib/guards/user-id.guard';
import { CardIdGuard } from 'src/lib/guards/card-id.guard';
import { CommentIdGuard } from 'src/lib/guards/comment-id.guard';
import { CardEntity } from 'src/lib/entities/card.entity';
import { UserEntity } from 'src/lib/entities/user.entity';
import { CommentEntity } from 'src/lib/entities/comment.entity';
import { SetActionType } from 'src/lib/decorators/action.decorator';
import { Action } from 'src/lib/providers/casl-ability.factory';

import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dot';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('comments')
@ApiBearerAuth()
@ApiParam({ name: 'userId', type: Number })
@ApiParam({ name: 'boardId', type: Number })
@ApiParam({ name: 'listId', type: Number })
@ApiParam({ name: 'cardId', type: Number })
@ApiForbiddenResponse({
  description: `You don\'t have permission to access the specified card\'s comments`,
})
@UseGuards(JwtAuthGuard, UserIdGuard, BoardIdGuard, ListIdGuard, CardIdGuard)
@Controller(
  'users/:userId/boards/:boardId/lists/:listId/cards/:cardId/comments',
)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ description: 'Creates new comment' })
  @ApiBadRequestResponse({
    description: 'validation error, emty comment text',
  })
  @SetActionType(Action.Create)
  @Post()
  async create(
    @Req() { user, card }: { user: UserEntity; card: CardEntity },
    @Body() data: CreateCommentDto,
  ) {
    return await this.commentService.create(user.id, card.id, data);
  }

  @ApiOperation({ description: 'Returns all comments of the scpecified card' })
  @SetActionType(Action.Read)
  @Get()
  async getByCard(@Param('cardId', ParseIntPipe) cardId: number) {
    return await this.commentService.getByCard(cardId);
  }

  @ApiOperation({ description: 'Returns the comment with the specified id' })
  @ApiParam({ name: 'commentId', type: Number })
  @UseGuards(CommentIdGuard)
  @SetActionType(Action.Read)
  @Get(':commentId')
  getById(@Req() { comment }: { comment: CommentEntity }) {
    delete comment.card;

    return comment;
  }

  @ApiOperation({ description: 'Updates the comment with the specified id' })
  @ApiParam({ name: 'commentId', type: Number })
  @ApiBadRequestResponse({
    description: 'validation error, emty comment text',
  })
  @ApiForbiddenResponse({
    description: `You don\'t have permission to update the specified comment, only owner can update it`,
  })
  @UseGuards(CommentIdGuard)
  @SetActionType(Action.Update)
  @Patch(':commentId')
  async update(
    @Req() { comment }: { comment: CommentEntity },
    @Body() data: UpdateCommentDto,
  ) {
    comment = Object.assign(comment, data);

    return await this.commentService.update(comment);
  }

  @ApiOperation({ description: 'Deletes the comment with the specified id' })
  @ApiParam({ name: 'commentId', type: Number })
  @ApiForbiddenResponse({
    description: `You don\'t have permission to update the specified comment, only owner can delete it`,
  })
  @UseGuards(CommentIdGuard)
  @SetActionType(Action.Delete)
  @Delete(':commentId')
  async delete(@Req() { comment }: { comment: CommentEntity }) {
    return await this.commentService.remove(comment);
  }
}
