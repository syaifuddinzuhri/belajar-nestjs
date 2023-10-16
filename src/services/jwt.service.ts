import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ADMIN, COOKIE_ACCESS_TOKEN_ADMIN, COOKIE_ACCESS_TOKEN_MEMBER, COOKIE_USER_ADMIN, COOKIE_USER_MEMBER, MEMBER } from 'src/helpers/constants';
import { getJwtKey, resetCookie } from 'src/helpers/functions';
import { Response } from 'express';
@Injectable()
export class JwtService {
  private readonly revokedTokens: Set<string> = new Set();

  revokeToken(token: string) {
    this.revokedTokens.add(token);
  }

  isTokenRevoked(token: string): boolean {
    return this.revokedTokens.has(token);
  }

  verifyToken(res: Response, token: string, type) {
    try {
      const decoded = jwt.verify(token, getJwtKey());
      return decoded;
    } catch (error) {
      if(type === ADMIN){
        resetCookie(res, COOKIE_ACCESS_TOKEN_ADMIN);
        resetCookie(res, COOKIE_USER_ADMIN);
      } else if (type === MEMBER){
        resetCookie(res, COOKIE_ACCESS_TOKEN_MEMBER);
        resetCookie(res, COOKIE_USER_MEMBER);
      }
      throw new Error('Token verification failed');
    }
  }
}
