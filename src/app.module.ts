/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatModule } from './cat/cat.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { userAuthMiddleware } from './user/middleware/user.middleware';
import * as dotenv from 'dotenv';

dotenv.config()
@Module({
  imports: [MongooseModule.forRoot(`mongodb+srv://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`), CatModule, ProductModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(userAuthMiddleware).forRoutes(
      // { path: 'user/logout', method: RequestMethod.GET },
      // { path: 'user/cart/:productId', method: RequestMethod.POST },
      // {path: 'user/cart/:productId', method: RequestMethod.DELETE},
      // {path: 'user/checkout', method: RequestMethod.GET}
      )
  }
}
