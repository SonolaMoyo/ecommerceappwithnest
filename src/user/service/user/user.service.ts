/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>){}

    async createUser(userDto: UserDto): Promise<User> {
        const createUser = new this.userModel(userDto);
        return createUser.save();
    }

    async getallUser(): Promise<User[]>{
        return await this.userModel.find().exec();
    }

    async getUser(id: string): Promise<User> {
        return await this.userModel.findById(id).exec();
    }

    async getUserByEmail(email: string) {
        return this.userModel.findOne({email}).exec();
    }

    async updateUser(id: string, updateUserDto: UserDto): Promise<User> | null {
        const user = await this.userModel.findById(id)
        if(!user){
            return null;
        }
        for (const key in updateUserDto){
            user[key] = updateUserDto[key];
        }
        return user.save();
    }

    async deleteUser(id: string) {
        const user = await this.userModel.findById(id);
        if(!user){
            return null;
        }
        await user.deleteOne();
    }
}
