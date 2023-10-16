import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { parse } from 'cookie';
import { JwtService } from 'src/services/jwt.service';
import { COOKIE_ACCESS_TOKEN_MEMBER, MEMBER } from 'src/helpers/constants';

@Injectable()
export class AuthMemberMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    const cookies = parse(req.headers.cookie || '');
    const cookieToken = cookies[COOKIE_ACCESS_TOKEN_MEMBER];
    if (token) {
      let status: boolean = false;
      try {
        const decoded = this.jwtService.verifyToken(res, token, MEMBER);
        if (
          (!decoded && decoded['type'] !== 'member') ||
          token !== cookieToken
        ) {
          throw new Error('Unauthenticated token');
        }

        const isTokenRevoked = this.jwtService.isTokenRevoked(token);

        if (isTokenRevoked) {
          throw new Error('Unauthenticated token');
        }
        status = true;
      } catch (error) {
        status = false;
      }

      if (!status) {
        throw new UnauthorizedException();
      }

      next();
      return;
    }

    throw new UnauthorizedException();
  }
}
