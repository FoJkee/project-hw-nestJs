import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../models/post.schema';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from '../../blog/models/blog.schema';
import { CreatePostDto } from '../dto/post.dto';
import { myStatusView, PostViewModels } from '../models/post.view.models';
import {
  Reaction,
  ReactionDocument,
} from '../../reaction/models/reaction.schema';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post.name) private readonly PostModel: Model<PostDocument>,
    @InjectModel(Blog.name) private readonly BlogModel: Model<BlogDocument>,
    @InjectModel(Reaction.name)
    private readonly ReactionModel: Model<ReactionDocument>,
  ) {}

  async createPost(newPost: Post): Promise<PostViewModels | boolean> {
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

  async getPostId(
    postId: string,
    userId: string | null,
  ): Promise<PostViewModels | null> {
    const result = await this.PostModel.findOne(
      { id: postId },
      { __v: 0, _id: 0, extendedLikesInfo: { _id: 0 } },
    ).lean();

    if (!result) return null;

    const newestLike = await this;
  }

  async deletePostId(postId: string): Promise<boolean> {
    try {
      await this.PostModel.findOneAndDelete({ id: postId });
      return true;
    } catch (e) {
      return false;
    }
  }
  async getUserLikePost(postId: string, userId: string) {
    return this.ReactionModel.findOne({ id: postId, userId });
  }

  async updatePostIdLikeStatus(
    postId: string,
    userId: string,
    userLogin: string,
    status: myStatusView,
  ): Promise<boolean> {
    const post = await this.getPostId(postId);
    if (!post) return false;

    await this.ReactionModel.updateOne(
      { postId, userId },
      {
        $set: { status, createAt: new Date().toISOString(), userLogin },
      },
      { upsert: true },
    );
    const [likesCount, dislikesCount] = await Promise.all([
      this.ReactionModel.countDocuments({ postId, status: myStatusView.Like }),
      this.ReactionModel.countDocuments({
        postId,
        status: myStatusView.DisLike,
      }),
    ]);
    post.extendedLikesInfo.likesCount = likesCount;
    post.extendedLikesInfo.dislikesCount = dislikesCount;

    await this.PostModel.updateOne({ id: post.id }, { ...post });
    return true;
  }
}
