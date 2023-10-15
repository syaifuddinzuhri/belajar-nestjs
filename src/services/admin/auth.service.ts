import { Injectable } from '@nestjs/common';
import { Response as Res, Request as Req } from 'express';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AdminDocument } from 'src/schemas';
import { JwtService } from '../jwt.service';
import { comparePassword, setObjectTypeId } from 'src/helpers/functions';
import { LoginDto } from 'src/decorators/login.dto';
import * as jwt from 'jsonwebtoken';
import { getJwtKey, getJwtTTL } from 'src/helpers/functions';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel('admin') private readonly adminSchema: Model<AdminDocument>,
  ) {}

  async login(body: LoginDto, res: Res, req: Req): Promise<any> {
    try {
      const admin = await this.getAdminByUsername(body.username);
      if (!admin) throw new Error('Username not found');

      const isPasswordValid = await comparePassword(
        body.password,
        admin['password'],
      );

      if (!isPasswordValid) throw new Error('Password incorrect');

      const token = await jwt.sign(
        {
          type: 'admin',
          username: body.username,
          userId: admin['_id'],
        },
        getJwtKey(),
        { expiresIn: getJwtTTL() },
      );
      res.cookie('access_token', token, {
        secure: true,
        maxAge: getJwtTTL(),
      });
      res.cookie('user', JSON.stringify(admin), {
        secure: true,
        maxAge: getJwtTTL(),
      });
      const profile = await this.profile(req);
      return {
        user: profile,
        access_token: token,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAdminByUsername(username: string): Promise<boolean | object> {
    try {
      return await this.adminSchema
        .findOne({ username: username })
        .select('+password');
    } catch (error) {
      return false;
    }
  }

  async profile(req: Req): Promise<any> {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = await this.jwtService.verifyToken(token);
    return await this.adminSchema
      .findById(setObjectTypeId(decoded['userId']))
      .exec();
  }

  async logout(req: Req, res: Res): Promise<any> {
    const token = req.headers.authorization?.split(' ')[1];
    await this.jwtService.revokeToken(token);
    res.cookie('access_token', '', { expires: new Date(0) });
    res.cookie('user', '', { expires: new Date(0) });
    return true;
  }
}
