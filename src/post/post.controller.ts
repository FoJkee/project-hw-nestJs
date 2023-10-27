import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreatePostDto } from './dto/post.dto';
import { PostService } from './post.service';
import { BlogService } from '../blog/blog.service';
import { PostViewModels } from './models/post.view.models';

@Controller('posts')
export class PostController {
  constructor(
    private postService: PostService,
    private blogService: BlogService,
  ) {}
  @Get()
  async getPosts() {
    return this.postService.getPosts();
  }

  @Post()
  @HttpCode(201)
  async createPost(
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostViewModels> {
    return this.postService.createPost(createPostDto, createPostDto.blogId);
  }

  @Get(':postId')
  async getPostId(
    @Param('postId') postId: string,
  ): Promise<PostViewModels | null> {
    return this.postService.getPostId(postId);
  }

  @Put(':postId')
  @HttpCode(204)
  async updatePost(
    @Param('postId') postId: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    const post = await this.postService.getPostId(postId);
    if (!post) throw new NotFoundException();
    return this.postService.updatePostId(postId, createPostDto);
  }

  @Delete('postId')
  @HttpCode(204)
  async deletePostId(@Param('postId') postId: string): Promise<boolean> {
    const post = await this.postService.getPostId(postId);
    if (!post) throw new NotFoundException();
    return this.postService.deletePostId(postId);
  }
}
