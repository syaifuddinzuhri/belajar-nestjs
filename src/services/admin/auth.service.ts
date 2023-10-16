import { Injectable } from '@nestjs/common';
import { Response as Res, Request as Req } from 'express';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AdminDocument } from 'src/schemas';
import { JwtService } from '../jwt.service';
import { comparePassword, resetCookie, setCookie, setObjectTypeId } from 'src/helpers/functions';
import { LoginDto } from 'src/decorators/login.dto';
import * as jwt from 'jsonwebtoken';
import { getJwtKey, getJwtTTL } from 'src/helpers/functions';
import { ADMIN, COOKIE_ACCESS_TOKEN_ADMIN, COOKIE_USER_ADMIN } from 'src/helpers/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel('admin') private readonly adminSchema: Model<AdminDocument>,
  ) { }

  async login(body: LoginDto, res: Res, req: Req): Promise<any> {
    try {
      let admin = await this.getAdminByUsername(body.username, false);
      if (!admin) throw new Error('Username not found');

      const isPasswordValid = await comparePassword(
        body.password,
        admin['password'],
      );

      if (!isPasswordValid) throw new Error('Password incorrect');

      resetCookie(res, COOKIE_ACCESS_TOKEN_ADMIN);
      resetCookie(res, COOKIE_USER_ADMIN);

      const token = await jwt.sign(
        {
          type: 'admin',
          username: body.username,
          userId: admin['_id'],
        },
        getJwtKey(),
        { expiresIn: getJwtTTL() },
      );

      setCookie(res, COOKIE_ACCESS_TOKEN_ADMIN, token)
      setCookie(res, COOKIE_USER_ADMIN, JSON.stringify(admin))

      admin = await this.getAdminByUsername(body.username);
      return {
        user: admin,
        access_token: token,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAdminByUsername(username: string, withoutPassword = true): Promise<boolean | object> {
    try {
      return await this.adminSchema
        .findOne({ username: username })
        .select(withoutPassword ? '-password' : '+password');
    } catch (error) {
      return false;
    }
  }

  async profile(req: Req, res: Res): Promise<any> {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = await this.jwtService.verifyToken(res, token, ADMIN);
    return await this.adminSchema
      .findById(setObjectTypeId(decoded['userId']))
      .exec();
  }

  async logout(req: Req, res: Res): Promise<any> {
    const token = req.headers.authorization?.split(' ')[1];
    await this.jwtService.revokeToken(token);
    resetCookie(res, COOKIE_ACCESS_TOKEN_ADMIN);
    resetCookie(res, COOKIE_USER_ADMIN);
    return true;
  }
}
