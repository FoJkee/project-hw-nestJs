import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { myStatusView } from '../../post/models/post.view.models';

export type ReactionDocument = HydratedDocument<Reaction>;

@Schema()
export class Reaction {
  @Prop({ required: true, type: String })
  userId: string;
  @Prop({ required: true, type: String })
  userLogin: string;
  @Prop({ required: true, type: String })
  postId: string;
  @Prop({ required: true, type: String })
  commentId: string;
  @Prop({ required: true, type: String })
  createAt: string;
  @Prop({ required: true, type: String, enum: myStatusView })
  status: myStatusView;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);
