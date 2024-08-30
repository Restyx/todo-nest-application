import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
  ApiTags,
  ApiBearerAuth,
  ApiParam,
  ApiOperation,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { UserIdGuard } from 'src/lib/guards/user-id.guard';
import { BoardIdGuard } from 'src/lib/guards/board-id.guard';
import { ListIdGuard } from 'src/lib/guards/list-id.guard';
import { CardIdGuard } from 'src/lib/guards/card-id.guard';
import { ListEntity } from 'src/lib/entities/list.entity';
import { CardEntity } from 'src/lib/entities/card.entity';
import { UserEntity } from 'src/lib/entities/user.entity';
import { SetActionType } from 'src/lib/decorators/action.decorator';
import {
  Action,
  CaslAbilityFactory,
} from 'src/lib/providers/casl-ability.factory';

import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ListService } from '../list/list.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateCardMembershipDto } from './dto/update-card-membership.dto';

@ApiTags('cards')
@ApiBearerAuth()
@ApiParam({ name: 'userId', type: Number })
@ApiParam({ name: 'boardId', type: Number })
@ApiParam({ name: 'listId', type: Number })
@ApiForbiddenResponse({
  description: `You don\'t have permission to access the specified list\'s cards`,
})
@UseGuards(JwtAuthGuard, UserIdGuard, BoardIdGuard, ListIdGuard)
@Controller('users/:userId/boards/:boardId/lists/:listId/cards')
export class CardController {
  constructor(
    private readonly cardService: CardService,
    private readonly listService: ListService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @ApiOperation({ description: 'Creates new card' })
  @ApiBadRequestResponse({
    description:
      'validation error, try to follow the specified data transfer object',
  })
  @SetActionType(Action.Create)
  @Post()
  async create(
    @Request() { list }: { list: ListEntity },
    @Body() data: CreateCardDto,
  ) {
    return await this.cardService.create(list, data);
  }

  @ApiOperation({
    description: 'Returns all cards of the specified list',
  })
  @SetActionType(Action.Read)
  @Get()
  async getByList(@Param('listId', ParseIntPipe) listId: number) {
    return await this.cardService.getByList(listId);
  }

  @ApiOperation({ description: 'Returns the card with the specified id' })
  @ApiParam({ name: 'cardId', type: Number })
  @ApiForbiddenResponse({
    description: `You don\'t have permission to access the specified card`,
  })
  @UseGuards(CardIdGuard)
  @SetActionType(Action.Read)
  @Get(':cardId')
  async getById(@Request() { card }: { card: CardEntity }) {
    delete card.list;

    return card;
  }

  @ApiOperation({
    description:
      'Updates the card with the specified id. Note: If new listId is provided but new position is not, card is moved to the end of new the list. If position is provided, updates positions of all other cards in parent list',
  })
  @ApiParam({ name: 'cardId', type: Number })
  @ApiForbiddenResponse({
    description: `You don\'t have permission to update the specified card or the input list`,
  })
  @ApiBadRequestResponse({
    description:
      'validation error, try to follow specified data transfer object',
  })
  @UseGuards(CardIdGuard)
  @SetActionType(Action.Update)
  @Patch(':cardId')
  async update(
    @Request() { user, card }: { user: UserEntity; card: CardEntity },
    @Body() data: UpdateCardDto,
  ) {
    if (data.listId !== undefined && data.listId !== card.listId) {
      const list = await this.listService.getById(data.listId);
      const ability = this.caslAbilityFactory.createForUser(user);

      if (ability.cannot(Action.Update, list)) throw new ForbiddenException();
      if (data.position === undefined) {
        data.position = list.cards.length;
      }
    }

    return this.cardService.update(card, data);
  }

  @ApiOperation({ description: 'Deletes the card with the specified id' })
  @ApiForbiddenResponse({
    description: `You don\'t have permission to delete the specified card`,
  })
  @UseGuards(CardIdGuard)
  @SetActionType(Action.Delete)
  @Delete(':cardId')
  async remove(@Request() { card }: { card: CardEntity }) {
    return this.cardService.remove(card);
  }

  @ApiOperation({
    description:
      'add user to members list of the specified card, members have permission to read all comments inside the card',
  })
  @ApiForbiddenResponse({
    description: `you don\'t have permission to update this card\'s membership`,
  })
  @ApiBadRequestResponse({ description: 'validation error: invalid userId' })
  @UseGuards(CardIdGuard)
  @SetActionType(Action.Update)
  @Post(':cardId/members')
  @HttpCode(200)
  async addMember(
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body() data: UpdateCardMembershipDto,
  ) {
    await this.cardService.addMember(cardId, data.memberId);
    return 'user added to card members';
  }

  @ApiOperation({
    description:
      'remove user from members list of the specified card, members have permission to read all comments inside the card',
  })
  @ApiForbiddenResponse({
    description: `you don\'t have permission to update this card\'s membership`,
  })
  @ApiBadRequestResponse({ description: 'validation error: invalid userId' })
  @UseGuards(CardIdGuard)
  @SetActionType(Action.Update)
  @Delete(':cardId/members')
  @HttpCode(200)
  async removeMember(
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body() data: UpdateCardMembershipDto,
  ) {
    await this.cardService.removeMember(cardId, data.memberId);
    return 'user removed from card members';
  }
}
