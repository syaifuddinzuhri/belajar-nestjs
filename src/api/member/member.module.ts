import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { GlobalModule } from 'src/modules/global.module';
import { AuthMemberMiddleware } from 'src/middlewares/auth-member.middleware';
import { API_PREFIX_MEMBER } from 'src/helpers/constants';
import { MEMBER_CONTROLLERS } from './member-controller';

@Module({
  imports: [GlobalModule],
  controllers: [...MEMBER_CONTROLLERS],
  providers: [],
})
export class MemberModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const excludedRoutes = [`${API_PREFIX_MEMBER}auth/login-with-google`];
    consumer
      .apply(AuthMemberMiddleware)
      .exclude(...excludedRoutes)
      .forRoutes(...MEMBER_CONTROLLERS);
  }
}
