import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BlogDocument = HydratedDocument<Blog>;

@Schema()
export class Blog {
  @Prop({ required: true, type: SchemaTypes.ObjectId })
  id: Types.ObjectId;
  @Prop({ required: true, type: String })
  name: string;
  @Prop({ required: true, type: String })
  description: string;
  @Prop({ required: true, type: String })
  websiteUrl: string;
  @Prop({ required: true, type: String })
  createdAt: string;
  @Prop({ required: true, type: Boolean, default: false })
  isMembership: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
