import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../blog/models/blog.schema';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../post/models/post.schema';
import { User, UserDocument } from '../user/models/user.schema';
import { UserService } from '../user/infrastructure/user.service';
import { UserRepository } from '../user/infrastructure/user.repository';
import { UserController } from '../user/infrastructure/user.controller';

@Injectable()
export class TestingService {
  constructor(
    @InjectModel(Blog.name) private BlogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private PostModel: Model<PostDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
  ) {}
  async deleteAll(): Promise<boolean> {
    try {
      await this.BlogModel.deleteMany({});
      await this.PostModel.deleteMany({});
      await this.UserModel.deleteMany({});
      return true;
    } catch {
      return false;
    }
  }
}
