import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reaction, ReactionDocument } from '../models/reaction.schema';
import { Model } from 'mongoose';
import { myStatusView } from '../../post/models/post.view.models';

@Injectable()
export class ReactionRepository {
  constructor(
    @InjectModel(Reaction.name)
    private readonly ReactionModel: Model<ReactionDocument>,
  ) {}

  async newestLike(postId: string, num: number): Promise<Reaction[]> {
    return this.ReactionModel.find({
      postId,
      status: myStatusView.Like,
    })
      .sort({
        createdAt: -1,
      })
      .limit(num);
  }
}
