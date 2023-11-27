import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserQueryDto } from '../dto/user.query.dto';
import { PaginationView } from '../../pagination/pagination';
import { UserViewModels } from '../models/user.view.models';
import { UserDto } from '../dto/user.dto';
import { BasicAuthGuard } from '../../guard/basic.auth.guard';
import { UserEntity } from '../models/user.schema';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(BasicAuthGuard)
  @Get('users')
  @HttpCode(200)
  async getUser(
    @Query() userQueryDto: UserQueryDto,
  ): Promise<PaginationView<UserViewModels[]>> {
    return this.userService.getUser(userQueryDto);
  }

  @Post('users')
  @UseGuards(BasicAuthGuard)
  @HttpCode(201)
  async createUser(@Body() userDto: UserDto) {
    const fullUser = (await this.userService.createUser(userDto)) as UserEntity;
    return {
      id: fullUser.id,
      login: fullUser.login,
      email: fullUser.email,
      createdAt: fullUser.createdAt,
    };
  }
  @UseGuards(BasicAuthGuard)
  @Delete('/users/:userId')
  @HttpCode(204)
  async deleteUserId(@Param('userId') userId: string): Promise<boolean> {
    try {
      return this.userService.deleteUserId(userId);
    } catch (e) {
      throw new NotFoundException();
    }
  }
}
