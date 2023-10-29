import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { myStatusView } from './post.view.models';

export class NewestLike {
  @Prop({ required: true, type: String })
  addedAt: string;
  @Prop({ required: true, type: String })
  userId: string;
  @Prop({ required: true, type: String })
  login: string;
}

export const NewestLikeSchema = SchemaFactory.createForClass(NewestLike);

export class extendedLikesInfo {
  @Prop({ required: true, type: Number, default: 0 })
  likesCount: number;
  @Prop({ required: true, type: Number, default: 0 })
  dislikesCount: number;
  @Prop({ required: true, enum: myStatusView, type: String })
  myStatus: myStatusView;
  @Prop({ required: true, type: [NewestLikeSchema] })
  newestLikes: NewestLike[];
}

export const extendedLikesInfoSchema =
  SchemaFactory.createForClass(extendedLikesInfo);

export type PostDocument = HydratedDocument<Post>;
@Schema()
export class Post {
  @Prop({ required: true, type: String })
  id: string;
  @Prop({ required: true, type: String })
  title: string;
  @Prop({ required: true, type: String })
  shortDescription: string;
  @Prop({ required: true, type: String })
  content: string;
  @Prop({ required: true, type: String })
  blogId: string;
  @Prop({ required: true, type: String })
  blogName: string;
  @Prop({ required: true, type: String })
  createdAt: string;
  @Prop({ required: true, type: extendedLikesInfoSchema })
  extendedLikesInfo: extendedLikesInfo;
}

export const PostSchema = SchemaFactory.createForClass(Post);
