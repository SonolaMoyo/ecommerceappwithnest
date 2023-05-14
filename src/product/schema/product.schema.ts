/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';

export type ProductDocument = HydratedDocument<Product>

@Schema()
export class Product {
    @Prop({type: String, required: true})
    productName: string;

    @Prop({type: String})
    imgLink: string;

    @Prop({type: String})
    quantity: string;

    @Prop({type: String})
    delivery: string;

    @Prop({type: String})
    fastestDelivery: string;

    @Prop({type: String})
    websiteLink: string;

    @Prop({ type: Number })
    rating: number;

    @Prop({ type: Number })
    rateAmount: number;

    @Prop({ type: String, required: true })
    category: string;

    @Prop()
    categoryDesc: string;

    @Prop()
    categoryImageLink: string;

    @Prop({ type: Number, required: true })
    price: number;

    @Prop([
        {
          title: { type: String },
          benefit: { type: String },
        },
      ])
      productBenefits;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
