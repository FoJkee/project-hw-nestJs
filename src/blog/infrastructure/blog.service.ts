import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Blog } from '../models/blog.schema';
import { CreateBlogDto } from '../dto/blog.dto';
import { BlogViewModels } from '../models/blog.view.models';
import { BlogRepository } from './blog.repository';
import { BlogQueryRepository } from './blog.query.repository';
import { BlogQueryDto } from '../dto/blog.query.dto';
import { PaginationView } from '../../pagination/pagination';
import { QueryDto } from '../../pagination/pagination.query.dto';
import mongoose, { Types } from 'mongoose';

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
      id: new mongoose.Types.ObjectId(), //mongoose.Types.ObjectId
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
    const blog = await this.blogRepository.findBlogId(blogId);
    if (!blog) throw new NotFoundException();
    return this.blogRepository.deleteBlogId(blogId);
  }

  async findBlogId(blogId: string) {
    const blog = await this.blogRepository.findBlogId(blogId);
    if (!blog) throw new NotFoundException();
    return blog;
  }

  async updateBlogId(createBlogDto: CreateBlogDto, blogId): Promise<boolean> {
    const blog = await this.findBlogId(blogId);
    if (!blog) throw new NotFoundException();
    return this.blogRepository.updateBlogId(createBlogDto, blogId);
  }

  async getPostForBlog(queryDto: QueryDto, blogId: string) {
    const blog = await this.blogRepository.findBlogId(blogId);
    if (!blog) throw new NotFoundException();
    return this.blogQueryRepository.getPostForBlog(queryDto, blogId);
  }
}
