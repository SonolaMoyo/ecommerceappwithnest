import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello there, Welcome with ecommerce with NestJs by Moyo Sonola!';
  }
}
