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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { UserIdGuard } from 'src/lib/guards/user-id.guard';
import { SetActionType } from 'src/lib/decorators/action.decorator';
import { Action } from 'src/lib/providers/casl-ability.factory';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ description: 'Creates new user' })
  @ApiConflictResponse({ description: 'email already exist' })
  @ApiBadRequestResponse({
    description:
      'validation error: can be incorrect email format, too short or long email and/or password',
  })
  @SetActionType(Action.Create)
  @Post()
  async create(
    @Body()
    data: CreateUserDto,
  ) {
    return await this.userService.create(data);
  }

  @ApiBearerAuth()
  @ApiOperation({
    description:
      'Returns all user information excluding password with the specified user id',
  })
  @ApiForbiddenResponse({
    description:
      "you don't have permission ot access specified user, each user has access only to their own data",
  })
  @UseGuards(JwtAuthGuard, UserIdGuard)
  @SetActionType(Action.Read)
  @Get(':userId')
  async findOne(
    @Param('userId', ParseIntPipe)
    id: number,
  ) {
    return await this.userService.getById(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ description: 'Updates the user with specified id' })
  @ApiForbiddenResponse({
    description:
      "you don't have permission ot update specified user, each user has access only to their own data",
  })
  @ApiBadRequestResponse({
    description:
      'validation error: can be incorrect email format, too short or long email and/or password',
  })
  @UseGuards(JwtAuthGuard, UserIdGuard)
  @SetActionType(Action.Update)
  @Patch(':userId')
  async update(
    @Param('userId', ParseIntPipe)
    id: number,
    @Body()
    data: UpdateUserDto,
  ) {
    return await this.userService.update(id, data);
  }

  @ApiBearerAuth()
  @ApiOperation({ description: 'Deletes the user with specified id' })
  @ApiForbiddenResponse({
    description:
      "you don't have permission ot delete specified user, each user has access only to their own data",
  })
  @UseGuards(JwtAuthGuard, UserIdGuard)
  @SetActionType(Action.Delete)
  @Delete(':userId')
  async delete(
    @Param('userId', ParseIntPipe)
    id: number,
  ) {
    return await this.userService.removeById(id);
  }
}
