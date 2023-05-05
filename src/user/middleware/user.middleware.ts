/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class userAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let token;
    try {
        const cookies = req.headers.cookie?.split(';').map(c => c.trim()) || [];
        console.log(cookies)
        const token = cookies.find(c => c.startsWith('ecommercetoken='));
        console.log(token)
    } catch (error) {
        console.log(error)
    }
    console.log("insided the user auth middleware");
    if (!token) {
      return res.status(403).send({message: "error", error: "Not authorised to access this route, Login"})
    }
    next();
  }
}