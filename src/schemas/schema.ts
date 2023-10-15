import { MemberSchema } from './member.schema';
import { AdminSchema } from './admin.schema';

export const MONGODB_SCHEMA = [
  { name: 'member', schema: MemberSchema },
  { name: 'admin', schema: AdminSchema },
];
