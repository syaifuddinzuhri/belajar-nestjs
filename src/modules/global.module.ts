import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { MONGODB_SCHEMA } from 'src/schemas/schema';
import { JwtService } from 'src/services/jwt.service';
import { AuthService as AuthAdminService } from 'src/services/admin/auth.service';
import { FirebaseService } from 'src/services/firebase.service';
import { AuthService as AuthMemberService } from 'src/services/member/auth.service';
import { SeederService } from 'src/services/seeder.service';

const SCHEMAS = [...MONGODB_SCHEMA];

@Module({
  imports: [MongooseModule.forFeature(SCHEMAS)],
  providers: [
    AuthAdminService,
    AuthMemberService,
    JwtService,
    FirebaseService,
    SeederService,
  ],
  exports: [
    MongooseModule,
    AuthAdminService,
    AuthMemberService,
    JwtService,
    SeederService,
    FirebaseService,
  ],
})
export class GlobalModule {}
