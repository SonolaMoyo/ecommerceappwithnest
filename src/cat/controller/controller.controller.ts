/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpException, HttpStatus, Param, Put, Post } from '@nestjs/common';
import { Delete } from '@nestjs/common/decorators';
import { CreatCatDto } from '../dto/create-cat.dto';
import { CatService } from '../services/services.service';

@Controller('cat')
export class CatController {
    constructor(private catService: CatService) { }

    @Get('')
    async getCat() {
        try {
            //this.catService.findAll().then((cats) => {return(cats)});
            const cats = await this.catService.getallCat();
            if (cats) {
                return cats;
            } else {
                return ({ message: "Oops there is no cat" });
            }
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }

    @Post('create')
    async createCat(@Body() createCatDto: CreatCatDto) {
        console.log(createCatDto)
        const didItCreate = this.catService.createCat(createCatDto);
        if (didItCreate) {
            return didItCreate;
        } else {
            throw new HttpException('Unable to create cat', HttpStatus.BAD_REQUEST)
        }
    }

    @Put('update/:id')
    async updateCat(@Param('id') id: string, @Body() updateCatDto: CreatCatDto) {
        try {
            const updateCat = await this.catService.updateCat(id, updateCatDto);
            return updateCat;
        } catch (error) {
        throw new HttpException(`Unable to complete update process. message:${error.message}`, HttpStatus.BAD_REQUEST)
        }
    }

    @Delete('delete/:id')
    async deleteCat(@Param('id') id: string){
        try {
            await this.catService.deleteCat(id);
            return({msg: 'Cat deleted successfully'})
        } catch (error) {
            throw new HttpException(`Unable to complete delete process. message:${error.message}`, HttpStatus.BAD_REQUEST)
        }
    }
}
