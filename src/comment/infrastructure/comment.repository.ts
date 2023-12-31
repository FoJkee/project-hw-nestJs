import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../models/comment.schema';
import { Model } from 'mongoose';
import { myStatusView } from '../../post/models/post.view.models';
import {
  Reaction,
  ReactionDocument,
} from '../../reaction/models/reaction.schema';
import { CommentViewModels } from '../models/comment.view.models';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name)
    private readonly CommentModel: Model<CommentDocument>,
    @InjectModel(Reaction.name)
    private readonly ReactionModel: Model<ReactionDocument>,
  ) {}

  async getCommentsId(commentId: string) {
    return this.CommentModel.findOne(
      { id: commentId },
      {
        __v: 0,
        _id: 0,
        postId: 0,
        'commentatorInfo._id': 0,
        'likesInfo._id': 0,
      },
    );
  }
  async deleteCommentId(commentId: string) {
    try {
      await this.CommentModel.findOneAndDelete({ id: commentId });
      return true;
    } catch (e) {
      return false;
    }
  }

  async updateCommentId(content: string, commentId: string) {
    try {
      await this.CommentModel.findOneAndUpdate(
        { id: commentId },
        { $set: { content } },
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  async updateCommentIdLikeStatus(
    userId: string,
    userLogin: string,
    commentId: string,
    status: myStatusView,
  ): Promise<boolean> {
    const comment = await this.getCommentsId(commentId);
    if (!comment) return false;
    await this.ReactionModel.updateOne(
      { userId, commentId },
      {
        $set: { status, createAt: new Date().toISOString(), userLogin },
      },
      { upsert: true },
    );

    const [likesCount, dislikesCount] = await Promise.all([
      this.ReactionModel.countDocuments({
        commentId,
        status: myStatusView.Like,
      }),
      this.ReactionModel.countDocuments({
        commentId,
        status: myStatusView.DisLike,
      }),
    ]);

    comment.likesInfo.likesCount = likesCount;
    comment.likesInfo.dislikesCount = dislikesCount;

    await this.CommentModel.updateOne(
      { id: comment.id },
      {
        $set: {
          ...comment,
          likesInfo: { ...comment.likesInfo, myStatus: status },
        },
      },
    );
    return true;
  }
  async createCommentForPost(
    newComment: Comment,
  ): Promise<CommentViewModels | null> {
    await this.CommentModel.create(newComment);
    return this.getCommentsId(newComment.id);
  }

  async getUserLikeComment(
    commentId: string,
    userId: string,
  ): Promise<Reaction | null> {
    return this.ReactionModel.findOne({ commentId, userId });
  }
}
