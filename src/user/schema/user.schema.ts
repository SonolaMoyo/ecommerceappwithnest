/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  phoneNumber: number;

  @Prop({ type: [String], ref: 'Product' })
  cart: string[];

  @Prop([
    {
      products: [{ type: String }],
      totalAmount: { type: Number },
      delivered: { type: Boolean, default: false },
      date: { type: Date, default: Date.now },
    },
  ])
  checkout: {
    products: string[];
    totalAmount: number;
    delivered: boolean;
    date: Date;
  }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
