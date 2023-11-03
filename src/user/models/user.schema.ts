import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
class emailConfirmation {
  @Prop({ required: true, type: String })
  codeConfirmation: string;
  @Prop({ required: true, type: String })
  expirationDate: string;
  @Prop({ required: true, type: Boolean, default: false })
  isConfirmed: boolean;
}

const emailConfirmationSchema = SchemaFactory.createForClass(emailConfirmation);

@Schema()
export class User {
  @Prop({ required: true, type: String })
  id: string;
  @Prop({ required: true, type: String })
  login: string;
  @Prop({ required: true, type: String })
  email: string;
  @Prop({ required: true, type: String })
  createdAt: string;
  @Prop({ required: true, type: String })
  passwordHash: string;
  @Prop({ required: true, type: emailConfirmationSchema })
  emailConfirmation: emailConfirmation;
}
export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
