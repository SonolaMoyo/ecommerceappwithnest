/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatModule } from './cat/cat.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { userAuthMiddleware } from './user/middlewares/user.middleware';
import { UserController } from './user/controller/user/user.controller';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://mosco_tech:root@cluster0.uz1qq.mongodb.net/nestjsapp?retryWrites=true&w=majority'), CatModule, ProductModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(userAuthMiddleware).forRoutes(UserController)
  }
}
