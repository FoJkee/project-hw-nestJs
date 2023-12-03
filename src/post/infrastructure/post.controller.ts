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
import { CreatePostForBlogDto } from '../dto/post.dto';
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
import { BearerUserIdGuard } from '../../guard/bearer.userId.guard';
import { PostRepository } from './post.repository';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly blogService: BlogService,
    private readonly postRepository: PostRepository,
  ) {}

  @Get()
  @UseGuards(BearerUserIdGuard)
  @HttpCode(200)
  async getPosts(@Query() queryDto: QueryDto, @UserId() userId) {
    return this.postService.getPosts(queryDto, userId);
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(201)
  async createPost(
    @Body() createPostForBlogDto: CreatePostForBlogDto,
  ): Promise<PostViewModels | null> {
    const blog = await this.blogService.findBlogId(createPostForBlogDto.blogId);
    if (!blog) return null;
    return await this.postService.createPost(
      createPostForBlogDto,
      createPostForBlogDto.blogId,
      blog.name,
    );
  }

  @Get(':postId')
  @UseGuards(BearerUserIdGuard)
  @HttpCode(200)
  async getPostId(
    @Param('postId') postId: string,
    @UserId() userId: string | null,
  ): Promise<PostViewModels | null> {
    const post = await this.postService.getPostId(postId, userId);
    if (!post) throw new NotFoundException();
    return post;
  }

  @UseGuards(BasicAuthGuard)
  @Put(':postId')
  @HttpCode(204)
  async updatePost(
    @Param('postId') postId: string,
    @Body() createPostForBlogDto: CreatePostForBlogDto,
  ) {
    const updatePost = await this.postService.updatePostId(
      postId,
      createPostForBlogDto,
    );
    if (!updatePost) throw new NotFoundException();
    return;
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':postId')
  @HttpCode(204)
  async deletePostId(@Param('postId') postId: string) {
    const deletePost = await this.postService.deletePostId(postId);
    if (!deletePost) throw new NotFoundException();
    return;
  }

  @Get(':postId/comments')
  @UseGuards(BearerUserIdGuard)
  @HttpCode(200)
  async getCommentForPost(
    @Param('postId') postId: string,
    @Query() queryDto: QueryDto,
    @UserId() userId: string | null,
  ): Promise<PaginationView<CommentViewModels[]>> {
    return this.postService.getCommentForPost(queryDto, postId, userId);
  }

  @UseGuards(BearerAuthGuard)
  @Post(':postId/comments')
  @HttpCode(201)
  async createCommentForPost(
    @Param('postId') postId: string,
    @Body() createCommentDto: CommentDto,
    @User() user: UserEntity,
  ): Promise<CommentViewModels> {
    const post = await this.postService.getPostId(postId, user.id);
    if (!post) throw new NotFoundException();
    return this.postService.createCommentForPost(
      postId,
      user,
      createCommentDto,
    );
  }
  @UseGuards(BearerAuthGuard)
  @Put(':postId/like-status')
  @HttpCode(204)
  async updatePostIdLikeStatus(
    @Param('postId') postId: string,
    @User() user: UserEntity,
    @Body() likeStatusDto: Reaction,
  ) {
    const result = await this.postService.updatePostIdLikeStatus(
      postId,
      user.id,
      user.login,
      likeStatusDto.likeStatus,
    );
    if (!result) throw new NotFoundException();
    return;
  }
}
