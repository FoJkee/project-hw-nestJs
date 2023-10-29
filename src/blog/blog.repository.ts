import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './models/blog.schema';
import { Model } from 'mongoose';
import { BlogViewModels } from './models/blog.view.models';
import { CreateBlogDto } from './dto/blog.dto';

@Injectable()
export class BlogRepository {
  constructor(
    @InjectModel(Blog.name) private readonly BlogModel: Model<BlogDocument>,
  ) {}

  async getBlogs(): Promise<BlogViewModels[]> {
    // const filter = {
    //   name: { $regex: blogQueryDto.searchNameTerm, $options: 'i' },
    // };

    // return this.BlogModel.find(filter, { _id: 0, __v: 0 })
    //   .sort({
    //     [blogQueryDto.sortBy]:
    //       blogQueryDto.sortDirection === 'asc' ? 'asc' : 'desc',
    //   })
    //   .skip((blogQueryDto.pageNumber - 1) * blogQueryDto.pageSize)
    //   .limit(blogQueryDto.pageSize);

    return this.BlogModel.find();
  }

  async createBlog(newBlog: Blog): Promise<boolean> {
    try {
      await this.BlogModel.create(newBlog);
      return true;
    } catch (e) {
      return false;
    }
  }

  async deleteBlogId(blogId: string): Promise<boolean> {
    try {
      await this.BlogModel.findOneAndDelete({ id: blogId });
      return true;
    } catch (e) {
      return false;
    }
  }

  async findBlogId(blogId: string) {
    return this.BlogModel.findOne({ id: blogId }, { __v: 0, _id: 0 });
  }

  async updateBlogId(createBlogDto: CreateBlogDto, blogId): Promise<boolean> {
    try {
      await this.BlogModel.findOneAndUpdate(
        { id: blogId },
        { $set: createBlogDto },
      );
      return true;
    } catch (e) {
      return false;
    }
  }
}
