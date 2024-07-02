import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiHeader,
} from '@nestjs/swagger';
import { AccessTokenDto } from './dto/access-token.dto';
import { LoggedUserDto } from './dto/logged-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({
    description: 'Пользователь создан',
    type: AccessTokenDto,
  })
  @ApiBadRequestResponse({
    description: 'Имя пользователя занято или введены неправильные данные',
  })
  @Post('/signup')
  signUp(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ access_token: string }> {
    return this.authService.signUp(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @ApiOkResponse({ description: 'авторизация успешна', type: AccessTokenDto })
  @ApiUnauthorizedResponse({ description: 'Неправильный пароль' })
  @ApiNotFoundResponse({ description: 'Пользователь с таким именем не найден' })
  @HttpCode(200)
  @Post('login')
  signIn(@Request() req): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'Токен авторизации',
    example:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNlcmVuZV91c2VybmFtZTMiLCJzdWIiOjMsImlhdCI6MTcxOTg0OTM4NiwiZXhwIjoxNzE5OTM1Nzg2fQ.FyyaHf_qd6zcog_65pjeWE_fJu8aw6FWfyzn_fHYjfs',
  })
  @ApiOkResponse({ description: 'Профиль найден', type: LoggedUserDto })
  @ApiUnauthorizedResponse({ description: 'Невалидный Bearer токен' })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req): Promise<{}> {
    return req.user;
  }
}
