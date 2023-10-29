import { BadRequestException, Injectable } from '@nestjs/common';
import { Blog } from './models/blog.schema';
import { CreateBlogDto } from './dto/blog.dto';
import { BlogViewModels } from './models/blog.view.models';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { BlogRepository } from './blog.repository';

@Injectable()
export class BlogService {
  constructor(private readonly blogRepository: BlogRepository) {}

  async getBlogs(): Promise<BlogViewModels[]> {
    return this.blogRepository.getBlogs();
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
    return this.blogRepository.deleteBlogId(blogId);
  }

  async findBlogId(blogId: string) {
    return this.blogRepository.findBlogId(blogId);
  }

  async updateBlogId(createBlogDto: CreateBlogDto, blogId): Promise<boolean> {
    return this.blogRepository.updateBlogId(createBlogDto, blogId);
  }
}
