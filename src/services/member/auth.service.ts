import { Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MemberDocument } from 'src/schemas';
import { LoginWithGoogleDto } from 'src/decorators/login-with-google.dto.';
import * as admin from 'firebase-admin';
import { InjectConnection } from '@nestjs/mongoose';
import { MongooseTransaction, resetCookie, setCookie, setObjectTypeId } from 'src/helpers/functions';
import * as jwt from 'jsonwebtoken';
import { getJwtKey, getJwtTTL } from 'src/helpers/functions';
import { Response as Res, Request as Req } from 'express';
import { JwtService } from '../jwt.service';
import { COOKIE_ACCESS_TOKEN_MEMBER, COOKIE_USER_MEMBER, MEMBER } from 'src/helpers/constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('member') private readonly memberSchema: Model<MemberDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly jwtService: JwtService,
  ) { }

  async loginWithGoogle(body: LoginWithGoogleDto, res: Res): Promise<any> {
    return MongooseTransaction(this.connection, async () => {
      const firebaseUser = await this.checkFirebaseUserByUid(body.firebaseUid);
      if (!firebaseUser) throw new Error('Firebase user not found');
      const payloadMember = {
        ...body,
        name: firebaseUser['displayName'],
      };
      let member = await this.getMemberByEmail(body.email);
      if (!member) {
        member = await this.memberSchema.create(payloadMember);
      }

      const token = await jwt.sign(
        {
          type: 'member',
          email: body.email,
          userId: member['_id'],
        },
        getJwtKey(),
        { expiresIn: getJwtTTL() },
      );
      setCookie(res, COOKIE_ACCESS_TOKEN_MEMBER, token)
      setCookie(res, COOKIE_USER_MEMBER, JSON.stringify(member))
      return {
        user: member,
        access_token: token,
      };
    });
  }

  async profile(req: Req, res: Res): Promise<any> {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = await this.jwtService.verifyToken(res, token, MEMBER);
    return await this.memberSchema
      .findById(setObjectTypeId(decoded['userId']))
      .exec();
  }

  async logout(req: Req, res: Res): Promise<any> {
    const token = req.headers.authorization?.split(' ')[1];
    await this.jwtService.revokeToken(token);
    resetCookie(res, COOKIE_ACCESS_TOKEN_MEMBER);
    resetCookie(res, COOKIE_USER_MEMBER);
    return true;
  }

  async checkFirebaseUserByUid(uid: string): Promise<boolean | object> {
    try {
      return await admin.auth().getUser(uid);
    } catch (error) {
      return false;
    }
  }

  async getMemberByEmail(email: string): Promise<boolean | object> {
    try {
      return await this.memberSchema.findOne({ email: email });
    } catch (error) {
      return false;
    }
  }
}
