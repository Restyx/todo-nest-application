import {
  Body,
  Controller,
  Delete,
  Get,
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

import { UserIdGuard } from 'src/lib/guards/user-id.guard';
import { BoardIdGuard } from 'src/lib/guards/board-id.guard';
import { ListIdGuard } from 'src/lib/guards/list-id.guard';
import { BoardEntity } from 'src/lib/entities/board.entity';
import { ListEntity } from 'src/lib/entities/list.entity';
import { Action } from 'src/lib/providers/casl-ability.factory';
import { SetActionType } from 'src/lib/decorators/action.decorator';

import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('lists')
@ApiBearerAuth()
@ApiParam({ name: 'userId', type: Number })
@ApiParam({ name: 'boardId', type: Number })
@ApiForbiddenResponse({
  description: `You don\'t have permission to access the specified board\'s lists`,
})
@UseGuards(JwtAuthGuard, UserIdGuard, BoardIdGuard)
@Controller('users/:userId/boards/:boardId/lists')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @ApiOperation({ description: 'Creates new list' })
  @ApiBadRequestResponse({
    description: 'validation error: not acceptable list name',
  })
  @SetActionType(Action.Create)
  @Post()
  create(
    @Request() { board }: { board: BoardEntity },
    @Body() data: CreateListDto,
  ) {
    return this.listService.create(board, data);
  }

  @ApiOperation({ description: 'Returns all lists of the specified board' })
  @SetActionType(Action.Read)
  @Get()
  getByBoard(@Param('boardId', ParseIntPipe) boardId: number) {
    return this.listService.getByBoard(boardId);
  }

  @ApiOperation({ description: 'Returns the list with the specified id' })
  @ApiForbiddenResponse({
    description: `You don\'t have permission to access the specified list`,
  })
  @ApiParam({ name: 'listId', type: Number })
  @UseGuards(ListIdGuard)
  @SetActionType(Action.Read)
  @Get(':listId')
  getById(@Request() { list }: { list: ListEntity }) {
    delete list.board;
    return list;
  }

  @ApiOperation({
    description:
      'Updates the list with the specified id. If new position is provided, updates all lists position in the parent board as well',
  })
  @ApiParam({ name: 'listId', type: Number })
  @ApiForbiddenResponse({
    description: `You don\'t have permission to update the specified list`,
  })
  @ApiBadRequestResponse({
    description: 'validation error: not acceptable list name or position',
  })
  @UseGuards(ListIdGuard)
  @SetActionType(Action.Update)
  @Patch(':listId')
  update(
    @Request() { list }: { list: ListEntity },
    @Body() data: UpdateListDto,
  ) {
    return this.listService.update(list, data);
  }

  @ApiOperation({ description: 'Deletes the list with the specified id' })
  @ApiParam({ name: 'listId', type: Number })
  @ApiForbiddenResponse({
    description: `You don\'t have permission to delete the specified list`,
  })
  @UseGuards(ListIdGuard)
  @SetActionType(Action.Delete)
  @Delete(':listId')
  remove(@Request() { list }: { list: ListEntity }) {
    return this.listService.remove(list);
  }
}
