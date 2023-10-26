import { Controller, Get, Post } from '@nestjs/common';

@Controller('posts')
export class PostController {
  constructor() {}
  @Get()
  async getPosts() {}

  @Post()
  async createPost() {}
}
