import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthAdminMiddleware } from 'src/middlewares/auth-admin.middleware';
import { GlobalModule } from 'src/modules/global.module';
import { API_PREFIX_ADMIN } from 'src/helpers/constants';
import { ADMIN_CONTROLLERS } from './admin-controller';

@Module({
  imports: [GlobalModule],
  controllers: [...ADMIN_CONTROLLERS],
  providers: [],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const excludedRoutes = [`${API_PREFIX_ADMIN}auth/login`];
    consumer
      .apply(AuthAdminMiddleware)
      .exclude(...excludedRoutes)
      .forRoutes(...ADMIN_CONTROLLERS);
  }
}
