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
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/blog.dto';
import { BlogViewModels } from './models/blog.view.models';
import { PostViewModels } from '../post/models/post.view.models';
import { PostService } from '../post/post.service';
import { CreatePostDto } from '../post/dto/post.dto';

@Controller('blogs')
export class BlogController {
  constructor(
    private blogService: BlogService,
    private postService: PostService,
  ) {}

  @Get()
  async getBlogs() // @Query() blogQueryDto: BlogQueryDto,
  : Promise<BlogViewModels[]> {
    return this.blogService.getBlogs();
  }

  @Post()
  @HttpCode(201)
  async createBlog(
    @Body() createBlogDto: CreateBlogDto,
  ): Promise<BlogViewModels | boolean> {
    return this.blogService.createBlog(createBlogDto);
  }

  @Get(':blogId/posts')
  findPostForBlog() {}

  @Post(':blogId/posts')
  @HttpCode(201)
  async createPostForBlog(
    @Param('blogId') blogId: string,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostViewModels> {
    const blog = await this.blogService.findBlogId(blogId);
    console.log('blog', blog);
    if (!blog) throw new NotFoundException();
    return this.postService.createPost(createPostDto, blog.id, blog.name);
  }

  @Get(':blogId')
  async findBlogId(@Param('blogId') blogId: string) {
    const blog = await this.blogService.findBlogId(blogId);
    if (!blog) throw new NotFoundException();
    return blog;
  }

  @Put(':blogId')
  @HttpCode(204)
  async updateBlogId(
    @Param('blogId') blogId: string,
    @Body() createBlogDto: CreateBlogDto,
  ): Promise<boolean> {
    const blog = await this.blogService.findBlogId(blogId);
    if (!blog) throw new NotFoundException();
    return this.blogService.updateBlogId(createBlogDto, blogId);
  }

  @Delete(':blogId')
  @HttpCode(204)
  async deleteBlogId(@Param('blogId') blogId: string): Promise<boolean> {
    const blog = await this.blogService.findBlogId(blogId);
    if (!blog) throw new NotFoundException();
    return this.blogService.deleteBlogId(blogId);
  }
}
