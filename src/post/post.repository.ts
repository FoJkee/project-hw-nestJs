import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './models/post.schema';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from '../blog/models/blog.schema';
import { PostViewModels } from './models/post.view.models';
import { retry } from 'rxjs';
import { CreatePostDto } from './dto/post.dto';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post.name) private readonly PostModel: Model<PostDocument>,
    @InjectModel(Blog.name) private readonly BlogModel: Model<BlogDocument>,
  ) {}

  async getPosts(): Promise<PostViewModels[]> {
    return this.PostModel.find();
  }

  async createPost(newPost: Post) {
    try {
      await this.PostModel.create(newPost);
      return true;
    } catch (e) {
      return false;
    }
  }

  async updatePostId(
    postId: string,
    createPostDto: CreatePostDto,
  ): Promise<boolean> {
    try {
      await this.PostModel.findOneAndUpdate(
        { id: postId },
        { $set: createPostDto },
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  async getPostId(postId: string): Promise<PostViewModels | null> {
    return this.PostModel.findOne({ id: postId }, { __v: 0, _id: 0 });
  }

  async deletePostId(postId: string): Promise<boolean> {
    try {
      await this.PostModel.findOneAndDelete({ id: postId });
      return true;
    } catch (e) {
      return false;
    }
  }
}
