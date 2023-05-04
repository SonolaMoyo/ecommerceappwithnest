/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatController } from './controller/controller.controller';
import { Cat, CatSchema } from './schemas/cat.schema';
import { CatService } from './services/services.service';

@Module({
  imports: [MongooseModule.forFeature([{name: Cat.name, schema: CatSchema}])],
  controllers: [CatController],
  providers: [CatService],
})
export class CatModule { }
