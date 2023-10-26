import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../blog/models/blog.schema';
import { Model } from 'mongoose';

@Injectable()
export class TestingService {
  constructor(@InjectModel(Blog.name) private BlogModel: Model<BlogDocument>) {}
  async deleteAll(): Promise<boolean> {
    try {
      await this.BlogModel.deleteMany({});
      return true;
    } catch {
      return false;
    }
  }
}
