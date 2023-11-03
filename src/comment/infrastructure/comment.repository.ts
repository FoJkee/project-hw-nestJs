import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../models/comment.schema';
import { Model } from 'mongoose';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name)
    private readonly CommentModel: Model<CommentDocument>,
  ) {}

  async getCommentsId(commentId: string) {
    return this.CommentModel.findOne(
      { id: commentId },
      { __v: 0, _id: 0, postId: 0 },
    );
  }
}
