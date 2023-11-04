import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Blog } from '../models/blog.schema';
import { CreateBlogDto } from '../dto/blog.dto';
import { BlogViewModels } from '../models/blog.view.models';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { BlogRepository } from './blog.repository';
import { BlogQueryRepository } from './blog.query.repository';
import { BlogQueryDto } from '../dto/blog.query.dto';
import { PaginationView } from '../../pagination/pagination';
import { QueryDto } from '../../pagination/pagination.query.dto';

@Injectable()
export class BlogService {
  constructor(
    private readonly blogRepository: BlogRepository,
    private blogQueryRepository: BlogQueryRepository,
  ) {}

  async getBlogs(
    blogQueryDto: BlogQueryDto,
  ): Promise<PaginationView<BlogViewModels[]>> {
    return this.blogQueryRepository.getBlogs(blogQueryDto);
  }

  async createBlog(
    createBlogDto: CreateBlogDto,
  ): Promise<BlogViewModels | boolean> {
    const newBlog: Blog = {
      id: randomStringGenerator(),
      name: createBlogDto.name,
      description: createBlogDto.description,
      websiteUrl: createBlogDto.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    const result = await this.blogRepository.createBlog(newBlog);
    if (!result) throw new BadRequestException();
    return newBlog;
  }

  async deleteBlogId(blogId: string): Promise<boolean> {
    const result = await this.blogRepository.deleteBlogId(blogId);
    if (!result) throw new NotFoundException();
    return result;
  }

  async findBlogId(blogId: string) {
    const result = await this.blogRepository.findBlogId(blogId);
    if (!result) throw new NotFoundException();
    return result;
  }

  async updateBlogId(createBlogDto: CreateBlogDto, blogId): Promise<boolean> {
    const result = await this.blogRepository.updateBlogId(
      createBlogDto,
      blogId,
    );
    if (!result) throw new NotFoundException();
    return result;
  }

  async getPostForBlog(queryDto: QueryDto, blogId: string) {
    const result = await this.blogQueryRepository.getPostForBlog(
      queryDto,
      blogId,
    );
    if (!result) throw new NotFoundException();
    return result;
  }
}
