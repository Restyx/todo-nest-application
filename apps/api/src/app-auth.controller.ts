import { AuthGuard } from '@app/shared';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auth')
export class AppAuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  @Post('signup')
  signUp(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.send(
      {
        cmd: 'signup-user',
      },
      {
        username,
        password,
      },
    );
  }

  @Post('signin')
  signIn(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.send(
      {
        cmd: 'signin-user',
      },
      {
        username,
        password,
      },
    );
  }

  @UseGuards(AuthGuard)
  @Get('signout')
  signOut(@Request() { user }) {
    return user;
  }
}
