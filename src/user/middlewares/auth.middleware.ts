import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user.entity';
import { UserService } from '../user.service';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // check token from header
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    const token = authHeader.split(' ')[1];

    try {
      const payload = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      console.log(payload.exp, Date.now() / 1000);

      const { email } = payload;
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException(
          'Token is invalid, please login again!',
        );
      }
      // attach to request object
      req.currentUser = user;
      next();
    } catch (error) {
      console.log('error from auth middleware: ', error);
      throw new UnauthorizedException(
        'Token is invalid or expired, please login again',
      );
    }
  }
}
