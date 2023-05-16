/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/product/schema/product.schema';
import { UserDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/schema/user.schema';
import { Twilio } from 'twilio';
import * as emailjs from "emailjs-com";

@Injectable()
export class UserService {
    private readonly twilioClient: Twilio;
    private readonly sendGridApiKey: string;
    private emailUserID = process.env.EMAILJS_USER_ID;
    private emailServiceID = process.env.EMAILJS_SERVICE_ID;
    private emailTemplateID = process.env.EMAILJS_TEMPLATE_ID;

    constructor(@InjectModel(User.name) private userModel: Model<User>, @InjectModel(Product.name) private productModel: Model<Product>) {}

    async createUser(userDto: UserDto): Promise<User> {
        const createUser = new this.userModel(userDto);
        return createUser.save();
    }

    async getallUser(): Promise<User[]> {
        return await this.userModel.find().exec();
    }

    async getUser(id: string): Promise<User> {
        return await this.userModel.findById(id).exec();
    }

    async getUserByEmail(email: string) {
        return this.userModel.findOne({ email }).exec();
    }

    async updateUser(id: string, updateUserDto: UserDto): Promise<User> | null {
        const user = await this.userModel.findById(id)
        if (!user) {
            return null;
        }
        for (const key in updateUserDto) {
            user[key] = updateUserDto[key];
        }
        return user.save();
    }

    async deleteUser(id: string) {
        const user = await this.userModel.findById(id);
        if (!user) {
            return null;
        }
        await user.deleteOne();
    }

    async addToCart(userId: string, productId: string) {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new Error('User not found');
        }
        if (!user.cart.includes(productId)) {
            user.cart.push(productId);
            await user.save();
        }
        return user;
    }

    async removeFromCart(userId: string, productId: string) {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new Error('User not found');
        }
        const index = user.cart.indexOf(productId);
        if (index >= 0) {
            user.cart.splice(index, 1);
            await user.save();
        } else {
            throw new Error('Product with Id not found');
        }
        return user;
    }

    async getUserEmailAndPhoneNumber(userId: string) {
        const user = await this.userModel.findById(userId).exec();
        return { email: user.email, phoneNumber: user.phoneNumber, name: user.name };
    }

    async getProductIdsInCart(userId: string) {
        const user = await this.userModel.findById(userId).exec();
        return user.cart;
    }

    async getProductsByIds(productIds: string[]) {
        const products = await this.productModel.find({ _id: { $in: productIds } }).select('productName price').exec();
        return products.map(product => ({ name: product.productName, price: product.price }));
    }

    async sumPrices(productIds: string[]) {
        const products = await this.productModel.find({ _id: { $in: productIds } }).select('price').exec();
        const prices = products.map(product => product.price);
        return prices.reduce((total, price) => total + price, 0);
    }

    async updateCheckout(userId: string, products: { name: string, price: number }[], totalAmount: number) {
        await this.userModel.findByIdAndUpdate(
            userId,
            {
                $push: { checkout: { products: products.map(product => product.name), totalAmount, delivered: true } },
                $set: { cart: [] },
            },
        ).exec();
    }

    async sendSms(toNo: number, content: string) {
        const to = toNo.toString();
        await this.twilioClient.messages.create({ body: content, to, from: process.env.TWILIO_PHONE_NUMBER }).then((resp) => console.log(resp))
    }

    async sendEmail(to_name: string, message: string, user_email: string) {
        try {
            await emailjs.send(this.emailServiceID, this.emailTemplateID, { to_name, message, user_email }, this.emailUserID)
        } catch (error) {
            return error
        }
    }
}

