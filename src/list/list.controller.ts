import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MoveListDto } from './dto/move-list.dto';
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { List } from './entities/list.entity';

@UseGuards(JwtAuthGuard)
@ApiTags('list')
@ApiHeader({
  name: 'Authorization',
  description: 'Токен авторизации',
  example:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNlcmVuZV91c2VybmFtZTMiLCJzdWIiOjMsImlhdCI6MTcxOTg0OTM4NiwiZXhwIjoxNzE5OTM1Nzg2fQ.FyyaHf_qd6zcog_65pjeWE_fJu8aw6FWfyzn_fHYjfs',
})
@ApiUnauthorizedResponse({ description: 'Невалидный Bearer токен' })
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Список задач создан',
    type: List,
  })
  create(@Request() req, @Body() createListDto: CreateListDto) {
    return this.listService.create(req.user.userId, createListDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Списки задач найдены', type: [List] })
  findAll(@Request() req) {
    return this.listService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Список задач найден', type: List })
  @ApiNotFoundResponse({
    description:
      'Список задач с указанным id принадлежащий пользователю не найден',
  })
  // @ApiForbiddenResponse({ description: 'Список задач не принадлежит пользователю' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.listService.findOne(+id, req.user.userId);
  }

  @Patch(':id')
  @Get(':id')
  @ApiOkResponse({ description: 'Список задач успешно обнавлен', type: List })
  @ApiNotFoundResponse({
    description:
      'Список задач с указанным id принадлежащий пользователю не найден',
  })
  // @ApiForbiddenResponse({ description: 'Список задач не принадлежит пользователю' })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateListDto: UpdateListDto,
  ) {
    return this.listService.update(+id, req.user.userId, updateListDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Список задач успешно удалён' })
  @ApiNotFoundResponse({
    description:
      'Список задач с указанным id принадлежащий пользователю не найден',
  })
  // @ApiForbiddenResponse({ description: 'Список задач не принадлежит пользователю' })
  remove(@Request() req, @Param('id') id: string) {
    return this.listService.remove(+id, req.user.userId);
  }

  @Put(':id/move')
  @ApiOkResponse({ description: 'Список задач успешно передвинут' })
  @ApiNotFoundResponse({
    description:
      'Список задач или Проект с указанным id принадлежащий пользователю не найден',
  })
  // @ApiForbiddenResponse({ description: 'Список задач не принадлежит пользователю' })
  moveTo(
    @Request() req,
    @Param('id') id: number,
    @Body() moveListDto: MoveListDto,
  ) {
    return this.listService.moveTo(req.user.userId, id, moveListDto);
  }
}
