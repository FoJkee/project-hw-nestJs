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
import { BlogService } from './blog.service';
import { CreateBlogDto } from '../dto/blog.dto';
import { BlogViewModels } from '../models/blog.view.models';
import { PostService } from '../../post/infrastructure/post.service';
import { CreatePostDto } from '../../post/dto/post.dto';
import { BlogQueryDto } from '../dto/blog.query.dto';
import { PostViewModels } from '../../post/models/post.view.models';
import { PaginationView } from '../../pagination/pagination';
import { QueryDto } from '../../pagination/pagination.query.dto';

@Controller('blogs')
export class BlogController {
  constructor(
    private blogService: BlogService,
    private postService: PostService,
  ) {}

  @Get()
  async getBlogs(
    @Query() blogQueryDto: BlogQueryDto,
  ): Promise<PaginationView<BlogViewModels[]>> {
    return await this.blogService.getBlogs(blogQueryDto);
  }

  @Post()
  @HttpCode(201)
  async createBlog(
    @Body() createBlogDto: CreateBlogDto,
  ): Promise<BlogViewModels | boolean> {
    return this.blogService.createBlog(createBlogDto);
  }

  @Get(':blogId/posts')
  async getPostForBlog(
    @Param('blogId') blogId: string,
    @Query() queryDto: QueryDto,
  ): Promise<PaginationView<PostViewModels[]> | null> {
    try {
      return await this.blogService.getPostForBlog(queryDto, blogId);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  @Post(':blogId/posts')
  @HttpCode(201)
  async createPostForBlog(
    @Param('blogId') blogId: string,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostViewModels | null> {
    try {
      const blog = await this.blogService.findBlogId(blogId);
      return await this.postService.createPost(
        createPostDto,
        blogId,
        blog!.name,
      );
    } catch {
      throw new NotFoundException();
    }
  }

  @Get(':blogId')
  async findBlogId(@Param('blogId') blogId: string) {
    try {
      return await this.blogService.findBlogId(blogId);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  @Put(':blogId')
  @HttpCode(204)
  async updateBlogId(
    @Param('blogId') blogId: string,
    @Body() createBlogDto: CreateBlogDto,
  ): Promise<boolean | null> {
    try {
      return this.blogService.updateBlogId(createBlogDto, blogId);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  @Delete(':blogId')
  @HttpCode(204)
  async deleteBlogId(@Param('blogId') blogId: string): Promise<boolean> {
    try {
      return await this.blogService.deleteBlogId(blogId);
    } catch (e) {
      throw new NotFoundException();
    }
  }
}
