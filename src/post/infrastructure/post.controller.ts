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
import { PostViewModels } from '../models/post.view.models';
import { QueryDto } from '../../pagination/pagination.query.dto';
import { PaginationView } from '../../pagination/pagination';

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
  ): Promise<PostViewModels | null> {
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
  ): Promise<PostViewModels | null> {
    try {
      return await this.postService.getPostId(postId);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  @Put(':postId')
  @HttpCode(204)
  async updatePost(
    @Param('postId') postId: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    try {
      return await this.postService.updatePostId(postId, createPostDto);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  @Delete(':postId')
  @HttpCode(204)
  async deletePostId(@Param('postId') postId: string): Promise<boolean> {
    try {
      return await this.postService.deletePostId(postId);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  @Get(':postId/comments')
  async getCommentForPost(
    @Param('postId') postId: string,
    @Query() queryDto: QueryDto,
  ): Promise<PaginationView<CommentViewModels[]>> {
    return this.postService.getCommentForPost(queryDto, postId);
  }
}
