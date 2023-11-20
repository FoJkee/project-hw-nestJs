import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @UseGuards(BasicAuthGuard)
  @Get()
  async getUser(
    @Query() userQueryDto: UserQueryDto,
  ): Promise<PaginationView<UserViewModels[]>> {
    return this.userService.getUser(userQueryDto);
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  @HttpCode(201)
  async createUser(@Body() userDto: UserDto): Promise<UserViewModels | null> {
    return this.userService.createUser(userDto);
  }
  @UseGuards(BasicAuthGuard)
  @Delete(':userId')
  @HttpCode(204)
  async deleteUserId(@Param('userId') userId: string) {
    return this.userService.deleteUserId(userId);
  }
}
