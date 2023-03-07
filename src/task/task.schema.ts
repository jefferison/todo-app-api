import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop()
  sharedWith: [String];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
