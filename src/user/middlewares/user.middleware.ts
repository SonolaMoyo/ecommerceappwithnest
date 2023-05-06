/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class userAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.ecommercetoken;
    console.log("insided the user auth middleware");
    if (!token) {
      return res.status(403).send({message: "error", error: "Not authorised to access this route, Login"})
    }
    next();
  }
}
