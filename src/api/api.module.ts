import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [MemberModule, AdminModule],
  providers: [],
})
export class ApiModule {}
