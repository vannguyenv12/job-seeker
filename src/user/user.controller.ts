import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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
import { PaginationDto } from './dtos/paginate.dto';
import { AuthorizationGuard } from 'src/guards/authorization.guard';

@Controller('api/v1/users')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get('/me')
  @Serialize(UserDto)
  @UseGuards(AuthGuard)
  getMe(@CurrentUser() user: User) {
    return user;
  }

  @Post('/register')
  @Serialize(UserDto)
  register(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }

  @Post('/login')
  @Serialize(UserDto)
  login(@Body() user: LoginUserDto) {
    return this.authService.login(user.email, user.password);
  }

  @Get('/logout')
  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  logout(@Request() req: Express.Request) {
    return this.authService.logout(req);
  }

  @Patch('/:id')
  @Serialize(UserDto)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  update(
    @Param('id') id: number,
    @Body() user: UpdateUserDto,
    @CurrentUser() currentUser,
  ) {
    return this.userService.update(id, user, currentUser);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  @UseGuards(new AuthorizationGuard(['ADMIN']))
  delete(@Param('id') id: number) {
    return this.userService.delete(id);
  }

  @Get()
  @Serialize(PaginationDto)
  @UseGuards(AuthGuard)
  @UseGuards(new AuthorizationGuard(['ADMIN']))
  getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('skill', new DefaultValuePipe('')) skill = '',
  ) {
    // return this.userService.findAll({ page, limit });
    return this.userService.findAll({ page, limit }, skill);
  }
}
