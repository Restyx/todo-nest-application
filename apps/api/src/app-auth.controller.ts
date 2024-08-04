import { CreateUserDto, LoginUserDto } from '@app/shared';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AppAuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  @ApiCreatedResponse({
    description: 'Пользователь создан',
  })
  @ApiBadRequestResponse({
    description: 'Имя пользователя занято или введены неправильные данные',
  })
  @Post('signup')
  signUp(@Body() data: CreateUserDto) {
    return this.authService.send(
      {
        cmd: 'signup-user',
      },
      data,
    );
  }

  @ApiOkResponse({ description: 'авторизация успешна' })
  @ApiUnauthorizedResponse({ description: 'Неправильный пароль' })
  @ApiNotFoundResponse({ description: 'Пользователь с таким именем не найден' })
  @Post('signin')
  signIn(@Body() data: LoginUserDto) {
    return this.authService.send(
      {
        cmd: 'signin-user',
      },
      data,
    );
  }

  // @UseGuards(AuthGuard)
  // @Get('signout')
  // signOut(@Request() { user }) {
  //   return user;
  // }
}
