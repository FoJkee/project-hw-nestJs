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
  Query,
} from '@nestjs/common';
import { CreatePostDto } from '../dto/post.dto';
import { PostService } from './post.service';
import { BlogService } from '../../blog/infrastructure/blog.service';
import { CommentViewModels } from '../../comment/models/comment.view.models';
import { QueryDto } from '../../blog/dto/blog.query.dto';
import { PostViewModels } from '../models/post.view.models';

@Controller('posts')
export class PostController {
  constructor(
    private postService: PostService,
    private blogService: BlogService,
  ) {}

  @Get()
  async getPosts(@Query() queryDto: QueryDto) {
    return this.postService.getPosts(queryDto);
  }

  @Post()
  @HttpCode(201)
  async createPost(
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostViewModels> {
    const blog = await this.blogService.findBlogId(createPostDto.blogId);
    if (!blog) throw new NotFoundException();
    return this.postService.createPost(
      createPostDto,
      createPostDto.blogId,
      blog.name,
    );
  }

  @Get(':postId')
  async getPostId(
    @Param('postId') postId: string,
  ): Promise<CommentViewModels | null> {
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
