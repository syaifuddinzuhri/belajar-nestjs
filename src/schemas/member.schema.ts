import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MemberDocument = Member & Document;

@Schema({ timestamps: true })
export class Member {
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true, index: true })
  name: string;

  @Prop({ default: '' })
  balance: number;

  @Prop({ default: '' })
  password: string;

  @Prop({ default: '' })
  firebaseUid: string;

  @Prop({ default: '' })
  photo: string;

  @Prop({ type: Date, default: '' })
  deletedAt: Date;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
