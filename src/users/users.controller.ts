import { Controller, Get, UseGuards, Req, Patch, Body } from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { JwtAuthenticationGuard } from '../auth/guards/jwt-authentication.guard';
import { RequestWithUser } from '../auth/types/request-with-user.type';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthenticationGuard)
  findOne(@Req() request: RequestWithUser) {
    return request.user;
  }

  @Patch('me')
  @UseGuards(JwtAuthenticationGuard)
  updateOne(
    @Req() request: RequestWithUser,
    @Body() updatedUserData: UpdateUserDto,
  ) {
    return this.usersService.updateUserById(request.user.id, updatedUserData);
  }
}
