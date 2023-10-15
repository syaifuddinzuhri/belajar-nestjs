import { Module } from '@nestjs/common';
import { CreateAdminCommand } from 'src/commands/create-admin.command';
import { GlobalModule } from './global.module';

@Module({
  imports: [GlobalModule],
  providers: [CreateAdminCommand],
  exports: [CreateAdminCommand],
})
export class SeederModule {}
