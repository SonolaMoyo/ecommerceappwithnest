/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controller/user/user.controller';
import { User, UserSchema } from './schema/user.schema';
import { UserService } from './service/user/user.service';
import { Product, ProductSchema } from 'src/product/schema/product.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema}]), MongooseModule.forFeature([{name: Product.name, schema:ProductSchema}])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
