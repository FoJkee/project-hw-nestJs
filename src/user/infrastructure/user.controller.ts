import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserQueryDto } from '../dto/user.query.dto';
import { PaginationView } from '../../pagination/pagination';
import { UserViewModels } from '../models/user.view.models';
import { UserDto } from '../dto/user.dto';
import * as readline from 'readline';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(
    @Query() userQueryDto: UserQueryDto,
  ): Promise<PaginationView<UserViewModels[]>> {
    return this.userService.getUser(userQueryDto);
  }

  @Post()
  @HttpCode(201)
  async createUser(@Body() userDto: UserDto): Promise<UserViewModels | null> {
    return this.userService.createUser(userDto);
  }

  @Delete(':userId')
  @HttpCode(204)
  async deleteUserId(@Param('userId') userId: string) {
    return this.userService.deleteUserId(userId);
  }
}
