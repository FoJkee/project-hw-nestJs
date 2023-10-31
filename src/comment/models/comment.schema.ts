import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { myStatusView } from '../../post/models/post.view.models';

export class LikesInfo {
  @Prop({ required: true, type: Number, default: 0 })
  likesCount: number;
  @Prop({ required: true, type: Number, default: 0 })
  dislikesCount: number;
  @Prop({ required: true, enum: myStatusView, type: String })
  myStatus: myStatusView;
}

const LikesInfoSchema = SchemaFactory.createForClass(LikesInfo);

export type CommentDocument = HydratedDocument<Comment>;
@Schema()
export class Comment {
  @Prop({ required: true, type: String })
  id: string;
  @Prop({ required: true, type: String })
  content: string;
  @Prop({ required: true, type: String })
  userId: string;
  @Prop({ required: true, type: String })
  userLogin: string;
  @Prop({ required: true, type: String })
  createdAt: string;
  @Prop({ required: true, type: LikesInfoSchema })
  likesInfo: LikesInfo;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
