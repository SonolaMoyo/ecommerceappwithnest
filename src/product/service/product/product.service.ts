/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { Product } from 'src/product/schema/product.schema';

@Injectable()
export class ProductService {
    constructor(@InjectModel(Product.name) private productModel: Model<Product>){}

    async createProduct(createProductDto: CreateProductDto): Promise<Product> {
        const createProduct = new this.productModel(createProductDto);
        return createProduct.save()
    }
    
    async getallProduct(): Promise<Product[]> {
        return await this.productModel.find().exec();
    }

    async updateProduct(id: string, updateProductDto: CreateProductDto): Promise<Product> | null {
        const product = await this.productModel.findById(id);
        if(!product){
            return null; 
        }
        for (const key in updateProductDto){
            product[key] = updateProductDto[key];
        }
        return product.save();
    }

    async deleteProduct(id: string){
        const product = await this.productModel.findById(id);
        if(!product){
            return null;
        }
        await product.deleteOne();
    }

    async getCategories() {
        const categoriesWithImageLinks = await this.productModel.aggregate([
            {
              $group: {
                _id: "$category",
              },
            },
            {
              $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "category",
                as: "products",
              },
            },
            {
              $project: {
                _id: 0,
                category: "$_id",
                categoryImageLink: { $first: "$products.categoryImageLink" },
              },
            },
          ]);
          
        return categoriesWithImageLinks;
    }
}