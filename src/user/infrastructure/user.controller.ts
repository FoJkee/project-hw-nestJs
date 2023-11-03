import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserQueryDto } from '../dto/user.query.dto';
import { PaginationView } from '../../pagination/pagination';
import { UserViewModels } from '../models/user.view.models';
import { UserDto } from '../dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(
    @Query() userQueryDto: UserQueryDto,
  ): Promise<PaginationView<UserViewModels[]>> {
    return await this.userService.getUser(userQueryDto);
  }

  @Post()
  @HttpCode(201)
  async createUser(@Body() userDto: UserDto): Promise<UserViewModels> {
    return this.userService.createUser(userDto);
  }

  @Delete(':userId')
  async deleteUserId(@Param('userId') userId: string): Promise<boolean> {
    return this.userService.deleteUserId(userId);
  }
}
