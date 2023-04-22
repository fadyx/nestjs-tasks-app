import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LogInDto } from './dto/logIn.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { JwtAuthenticationGuard } from './guards/jwt-authentication.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalAuthenticationGuard } from './guards/local-authentication.guard';
import { RequestWithUser } from './types/request-with-user.type';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @ApiBody({ type: RegisterDto })
  async register(@Body() registrationData: RegisterDto) {
    const user = await this.authService.register(registrationData);

    const accessToken = this.authService.getJwtAccessToken(user.id);
    const refreshToken = this.authService.getJwtRefreshToken(user.id);

    await this.usersService.setActiveRefreshToken(user.id, refreshToken);

    return { user, tokens: { refresh: refreshToken, access: accessToken } };
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  @ApiBody({ type: LogInDto })
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;

    const accessToken = this.authService.getJwtAccessToken(user.id);
    const refreshToken = this.authService.getJwtRefreshToken(user.id);

    await this.usersService.setActiveRefreshToken(user.id, refreshToken);

    return { user, tokens: { refresh: refreshToken, access: accessToken } };
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    await this.usersService.removeRefreshToken(request.user.id);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessToken = this.authService.getJwtAccessToken(request.user.id);
    return { accessToken };
  }

  @Delete('terminate/me')
  @UseGuards(LocalAuthenticationGuard)
  remove(@Req() request: RequestWithUser) {
    return this.usersService.deleteOneById(request.user.id);
  }
}
