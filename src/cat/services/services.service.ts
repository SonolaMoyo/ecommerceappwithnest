/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatCatDto } from '../dto/create-cat.dto';
import { Cat } from '../schemas/cat.schema';

@Injectable()
export class CatService {
    constructor(@InjectModel(Cat.name) private catModel: Model<Cat>) {}

    async createCat(createCatDto: CreatCatDto): Promise<Cat> {
        const creatCat = new this.catModel(createCatDto)
        return creatCat.save();
    }

    async getallCat(): Promise<Cat[]> {
        return await this.catModel.find().exec();
    }

    async updateCat(id: string, updateCatDto: CreatCatDto): Promise<Cat> | null {
        const cat = await this.catModel.findById(id);
        if(!cat){
            throw new HttpException('Cannot find Cat', HttpStatus.NOT_FOUND)
        }
        for (const key in updateCatDto){
            cat[key] = updateCatDto[key];
        }
        return cat.save();
    }

    async deleteCat(id: string){
        const cat = await this.catModel.findById(id);
        if(!cat){
            throw new HttpException('Cannot find Cat', HttpStatus.NOT_FOUND)
        }
        await cat.deleteOne();
    }
}
