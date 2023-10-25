import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './models/blog.schema';
import { Model } from 'mongoose';
import { CreateBlogDto } from './dto/blog.dto';
import { BlogViewModels } from './models/blog.view.models';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private BlogModel: Model<BlogDocument>) {}

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

    return this.BlogModel.find({}, { __v: 0, _id: 0 });
  }

  async createBlog(createBlogDto: CreateBlogDto): Promise<BlogViewModels> {
    const newBlog: Blog = {
      id: randomStringGenerator(),
      name: createBlogDto.name,
      description: createBlogDto.description,
      websiteUrl: createBlogDto.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    const result = this.BlogModel.insertMany(newBlog);
    if (!result) throw new BadRequestException();
    return { ...newBlog };
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
  async updateBlogId(createBlogDto: CreateBlogDto, blogId) {
    return this.BlogModel.findOneAndUpdate(
      { id: blogId },
      {
        $set: {
          name: createBlogDto.name,
          description: createBlogDto.description,
          websiteUrl: createBlogDto.websiteUrl,
        },
      },
    );
  }
}
