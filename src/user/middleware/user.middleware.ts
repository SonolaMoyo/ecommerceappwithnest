/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class userAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let token = "";
    try {
      const cookies = req.headers.cookie?.split(';').map(c => c.trim()) || [];
    token = cookies.find(c => c.startsWith('ecommercetoken='));
    const value = token.split('=')[1];
    const decoded = decodeURIComponent(value);
    const parsed = JSON.parse(decoded.substring(2));
    const id = parsed.id;
    req['userId'] = id;
    } catch (error) {
      throw new HttpException(`Not authorised to access this route, Login`, HttpStatus.BAD_REQUEST)
    }
    if (!token) {
      return res.status(403).send({ message: "error", error: "Not authorised to access this route, Login" })
    }
    next();
  }
}