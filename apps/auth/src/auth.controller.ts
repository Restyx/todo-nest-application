import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@app/shared';
import { LoginUserDto } from './dto/login-user.dto';
import { SharedService } from '@app/shared';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'signup-user' })
  signUp(
    @Payload() data: CreateUserDto,
    @Ctx() context: RmqContext,
  ): Promise<User> {
    this.sharedService.acknowledgeMessage(context);

    return this.authService.signUp(data);
  }

  @MessagePattern({ cmd: 'signin-user' })
  signIn(
    @Payload() data: LoginUserDto,
    @Ctx() context: RmqContext,
  ): Promise<{ access_token: string }> {
    this.sharedService.acknowledgeMessage(context);

    return this.authService.signIn(data);
  }

  @MessagePattern({ cmd: 'verify-token' })
  verifyJwt(
    @Ctx() context: RmqContext,
    @Payload() payload: { access_token: string },
  ) {
    this.sharedService.acknowledgeMessage(context);

    return this.authService.verifyJwt(payload.access_token);
  }
}
