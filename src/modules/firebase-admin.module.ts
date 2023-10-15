/* eslint-disable @typescript-eslint/no-var-requires */
import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

@Module({
  providers: [
    {
      provide: 'FirebaseAdmin',
      useFactory: () => {
        const configPath = path.join(
          __dirname,
          '../../',
          process.env.FIREBASE_CREDENTIALS,
        );
        const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        admin.initializeApp({
          credential: admin.credential.cert(firebaseConfig),
        });
        return admin;
      },
    },
  ],
  exports: ['FirebaseAdmin'],
})
export class FirebaseAdminModule {}
