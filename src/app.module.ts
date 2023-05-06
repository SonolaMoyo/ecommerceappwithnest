/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatModule } from './cat/cat.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { userAuthMiddleware } from './user/middleware/user.middleware';
//import { UserController } from './user/controller/user/user.controller';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://...'), CatModule, ProductModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(userAuthMiddleware).forRoutes({path: 'user/logout', method: RequestMethod.POST})
  }
}
