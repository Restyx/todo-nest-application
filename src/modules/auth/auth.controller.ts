import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UserEntity } from 'src/lib/entities/user.entity';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AccessTokenDto } from './dto/access-token.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ description: 'Logs user in and return auth bearer token' })
  @ApiResponse({ status: 401, description: 'incorrenct email or password' })
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  signIn(
    @Request() { user }: { user: UserEntity },
    @Body() data: LoginDto,
  ): Promise<AccessTokenDto> {
    return this.authService.login(user);
  }
  
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Request() { user }: { user: UserEntity }) {
    return user;
  }
}
