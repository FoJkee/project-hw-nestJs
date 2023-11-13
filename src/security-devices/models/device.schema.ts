import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Device {
  @Prop({ required: true, type: String })
  ip: string;
  @Prop({ required: true, type: String })
  userId: string;
  @Prop({ required: true, type: String })
  deviceId: string;
  @Prop({ required: true, type: String })
  title: string;
  @Prop({ required: true, type: String })
  lastActiveDate: string;
}

export type DeviceDocument = HydratedDocument<Device>;

export const DeviceSchema = SchemaFactory.createForClass(Device);
