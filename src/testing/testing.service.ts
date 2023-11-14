import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../blog/models/blog.schema';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../post/models/post.schema';
import { UserEntity, UserDocument } from '../user/models/user.schema';
import {
  Device,
  DeviceDocument,
} from '../security-devices/models/device.schema';
import { Comment, CommentDocument } from '../comment/models/comment.schema';

@Injectable()
export class TestingService {
  constructor(
    @InjectModel(Blog.name) private readonly BlogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private readonly PostModel: Model<PostDocument>,
    @InjectModel(UserEntity.name)
    private readonly UserModel: Model<UserDocument>,
    @InjectModel(Device.name)
    private readonly DeviceModel: Model<DeviceDocument>,
    @InjectModel(Comment.name)
    private readonly CommentModel: Model<CommentDocument>,
  ) {}
  async deleteAll(): Promise<boolean> {
    try {
      await this.BlogModel.deleteMany({});
      await this.PostModel.deleteMany({});
      await this.UserModel.deleteMany({});
      await this.DeviceModel.deleteMany({});
      await this.CommentModel.deleteMany({});
      return true;
    } catch {
      return false;
    }
  }
}
