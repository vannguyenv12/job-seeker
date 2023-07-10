import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import Express from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('api/v1/users')
@Serialize(UserDto)
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get('/me')
  @UseGuards(AuthGuard)
  getAll(@CurrentUser() user: User) {
    return user;
  }

  @Post('/register')
  register(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }

  @Post('/login')
  login(@Body() user: LoginUserDto) {
    return this.authService.login(user.email, user.password);
  }

  @Get('/logout')
  logout(@Request() req: Express.Request) {
    return this.authService.logout(req);
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  update(@Param('id') id: number, @Body() user: UpdateUserDto) {
    return this.userService.update(id, user);
  }

  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.userService.delete(id);
  }
}
