import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../blog/models/blog.schema';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../post/models/post.schema';

@Injectable()
export class TestingService {
  constructor(
    @InjectModel(Blog.name) private BlogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private PostModel: Model<PostDocument>,
  ) {}
  async deleteAll(): Promise<boolean> {
    try {
      await this.BlogModel.deleteMany({});
      await this.PostModel.deleteMany({});
      return true;
    } catch {
      return false;
    }
  }
}
