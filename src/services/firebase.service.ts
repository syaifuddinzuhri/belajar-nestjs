import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

export class FirebaseService {
  private firebaseConfig: any;

  constructor() {
    const configPath = path.join(
      __dirname,
      '../../',
      process.env.FIREBASE_CREDENTIALS,
    );
    this.firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(this.firebaseConfig),
    });
  }

  // You can add other Firebase-related methods here
}
