import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { getJwtKey } from 'src/helpers/functions';

@Injectable()
export class JwtService {
  private readonly revokedTokens: Set<string> = new Set();

  revokeToken(token: string) {
    this.revokedTokens.add(token);
  }

  isTokenRevoked(token: string): boolean {
    return this.revokedTokens.has(token);
  }

  verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, getJwtKey());
      return decoded;
    } catch (error) {
      throw new Error('Token verification failed');
    }
  }
}
