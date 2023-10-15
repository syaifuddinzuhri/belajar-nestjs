import { ApiModule } from './api/api.module';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { API_ROUTES } from './api/api-routes';

const ROUTES = [...API_ROUTES];

@Module({
  imports: [ApiModule, RouterModule.register(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
