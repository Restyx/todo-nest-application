import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { BoardEntity } from 'src/lib/entities/board.entity';
import { UserIdGuard } from 'src/lib/guards/user-id.guard';
import { BoardIdGuard } from 'src/lib/guards/board-id.guard';
import { SetActionType } from 'src/lib/decorators/action.decorator';
import { Action } from 'src/lib/providers/casl-ability.factory';

import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateBoardMembershipDto } from './dto/update-board-membership.dto';

@ApiTags('boards')
@ApiBearerAuth()
@ApiParam({ name: 'userId', type: Number })
@ApiForbiddenResponse({
  description: `the userId you specified is not equal to userId in Bearer Token`,
})
@UseGuards(JwtAuthGuard, UserIdGuard)
@Controller('users/:userId/boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @ApiOperation({ description: 'Creates new board' })
  @ApiBadRequestResponse({
    description:
      'validation error, try to follow the specified data transfer object',
  })
  @SetActionType(Action.Create)
  @Post()
  create(
    @Param('userId', ParseIntPipe)
    userId: number,
    @Body()
    data: CreateBoardDto,
  ) {
    return this.boardService.create(userId, data);
  }

  @ApiOperation({ description: 'Returns all boards of the specified user' })
  @SetActionType(Action.Read)
  @Get()
  getByUser(
    @Param('userId', ParseIntPipe)
    userId: number,
  ) {
    return this.boardService.getByUser(userId);
  }

  @ApiOperation({ description: 'Returns the board with the specified id' })
  @ApiParam({ name: 'boardId', type: Number })
  @ApiForbiddenResponse({
    description: `you don\'t have permission to access the specified board`,
  })
  @UseGuards(BoardIdGuard)
  @SetActionType(Action.Read)
  @Get(':boardId')
  async getById(@Request() { board }: { board: BoardEntity }) {
    delete board.user;

    return board;
  }

  @ApiOperation({ description: 'Updates the board with the specified id' })
  @ApiBadRequestResponse({
    description:
      'validation error, try to follow the specified data transfer object',
  })
  @ApiForbiddenResponse({
    description: `you don\'t have permission to update the specified board`,
  })
  @ApiParam({ name: 'boardId', type: Number })
  @UseGuards(BoardIdGuard)
  @SetActionType(Action.Update)
  @Patch(':boardId')
  async update(
    @Request() { board }: { board: BoardEntity },
    @Body() data: UpdateBoardDto,
  ) {
    Object.assign(board, data);

    return this.boardService.update(board);
  }

  @ApiOperation({ description: 'Deletes the board with the specified id' })
  @ApiForbiddenResponse({
    description: `you don\'t have permission to delete specified board`,
  })
  @ApiParam({ name: 'boardId', type: Number })
  @UseGuards(BoardIdGuard)
  @SetActionType(Action.Delete)
  @Delete(':boardId')
  async delete(@Request() { board }: { board: BoardEntity }) {
    return this.boardService.removeById(board);
  }

  @ApiOperation({
    description:
      'add user to members list of the specified board, members have permission to read all list and cards inside the board',
  })
  @ApiForbiddenResponse({
    description: `you don\'t have permission to update this boards membership`,
  })
  @ApiBadRequestResponse({ description: 'validation error: invalid userId' })
  @UseGuards(BoardIdGuard)
  @SetActionType(Action.Update)
  @Post(':boardId/members')
  @HttpCode(200)
  async addMember(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() data: UpdateBoardMembershipDto,
  ) {
    await this.boardService.addMember(boardId, data.memberId);
    return 'user added to board members';
  }

  @ApiOperation({
    description:
      'remove user from members list of the specified board, members have permission to read all list and cards inside the board',
  })
  @ApiForbiddenResponse({
    description: `you don\'t have permission to update this boards membership`,
  })
  @ApiBadRequestResponse({ description: 'validation error: invalid userId' })
  @UseGuards(BoardIdGuard)
  @SetActionType(Action.Update)
  @Delete(':boardId/members')
  @HttpCode(200)
  async removeMember(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() data: UpdateBoardMembershipDto,
  ) {
    await this.boardService.removeMember(boardId, data.memberId);
    return 'user removed from board members';
  }
}
