import { AdminModule } from './admin/admin.module';
import { MemberModule } from './member/member.module';

export const API_ROUTES = [
  {
    path: 'api',
    children: [
      {
        path: 'member',
        module: MemberModule,
      },
      {
        path: 'admin',
        module: AdminModule,
      },
    ],
  },
];
