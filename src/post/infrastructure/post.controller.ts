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
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from '../dto/post.dto';
import { PostService } from './post.service';
import { BlogService } from '../../blog/infrastructure/blog.service';
import { CommentViewModels } from '../../comment/models/comment.view.models';
import { PostViewModels } from '../models/post.view.models';
import { QueryDto } from '../../pagination/pagination.query.dto';
import { PaginationView } from '../../pagination/pagination';
import { CommentDto } from '../../comment/dto/comment.dto';
import { User } from '../../decorators/user.decorator';
import { UserEntity } from '../../user/models/user.schema';
import { Reaction } from '../../reaction/dto/reaction.dto';
import { UserId } from '../../decorators/userId.decorator';
import { BasicAuthGuard } from '../../guard/basic.auth.guard';
import { BearerAuthGuard } from '../../guard/bearer.auth.guard';

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

  @UseGuards(BasicAuthGuard)
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

  @UseGuards(BasicAuthGuard)
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

  @UseGuards(BearerAuthGuard)
  @Post(':postId/comments')
  async createCommentForPost(
    @Param('postId') postId: string,
    @Body() createCommentDto: CommentDto,
    @UserId() userId,
  ): Promise<CommentViewModels> {
    return this.postService.createCommentForPost(
      postId,
      userId,
      createCommentDto,
    );
  }
  @UseGuards(BearerAuthGuard)
  @Put(':postId/like-status')
  async updatePostIdLikeStatus(
    @Param('postId') postId: string,
    @User() user: UserEntity,
    @Body() likeStatusDto: Reaction,
  ) {
    return this.postService.updatePostIdLikeStatus(
      postId,
      user.id,
      user.login,
      likeStatusDto.likeStatus,
    );
  }
}
