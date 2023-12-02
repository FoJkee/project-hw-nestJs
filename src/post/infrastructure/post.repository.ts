import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../models/post.schema';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from '../../blog/models/blog.schema';
import { CreatePostDto, CreatePostForBlogDto } from '../dto/post.dto';
import { myStatusView, PostViewModels } from '../models/post.view.models';
import {
  Reaction,
  ReactionDocument,
} from '../../reaction/models/reaction.schema';
import { ReactionRepository } from '../../reaction/infrastructure/reaction.repository';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post.name) private readonly PostModel: Model<PostDocument>,
    @InjectModel(Blog.name) private readonly BlogModel: Model<BlogDocument>,
    @InjectModel(Reaction.name)
    private readonly ReactionModel: Model<ReactionDocument>,
    private readonly reactionRepository: ReactionRepository,
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
    createPostForBlogDto: CreatePostForBlogDto,
  ): Promise<boolean> {
    try {
      await this.PostModel.findOneAndUpdate(
        { id: postId },
        { $set: createPostForBlogDto },
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
    const post = await this.PostModel.findOne(
      { id: postId },
      { __v: 0, _id: 0, 'extendedLikesInfo._id': 0 },
    ).lean();

    if (!post) return null;

    if (userId) {
      const userLikePost = await this.getUserLikePost(postId, userId);
      if (userLikePost) {
        post.extendedLikesInfo.myStatus = userLikePost.status;
      }
    }

    const newestLike = await this.reactionRepository.newestLike(postId);

    const newestLikeMap = newestLike.map((el) => ({
      addedAt: el.createAt,
      userId: el.userId,
      login: el.userLogin,
    }));

    return {
      ...post,
      extendedLikesInfo: {
        ...post.extendedLikesInfo,
        newestLikes: newestLikeMap,
      },
    };
  }

  async deletePostId(postId: string) {
    try {
      return this.PostModel.findOneAndDelete({ id: postId });
    } catch (e) {
      return false;
    }
  }
  async getUserLikePost(
    postId: string,
    userId: string | null,
  ): Promise<Reaction | null> {
    return this.ReactionModel.findOne({ id: postId, userId });
  }

  async updatePostIdLikeStatus(
    postId: string,
    userId: string,
    userLogin: string,
    status: myStatusView,
  ): Promise<boolean> {
    const post = await this.getPostId(postId, userId);
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

    await this.PostModel.updateOne(
      { id: post.id },
      {
        $set: {
          extendedLikesInfo: { ...post.extendedLikesInfo, myStatus: status },
        },
      },
    );
    return true;
  }
}
