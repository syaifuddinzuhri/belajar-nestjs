import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './pipes/validation.pipe';
import { NotFoundFilter } from './helpers/filters/not-found.filter';
import { UnauthorizedFilter } from './helpers/filters/unauthorized.filter';
import { InternalServerErrorFilter } from './helpers/filters/internal-server-error.filter';
import { BadRequestErrorFilter } from './helpers/filters/bad-request.filter';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error'], // only errors
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new NotFoundFilter());
  app.useGlobalFilters(new UnauthorizedFilter());
  app.useGlobalFilters(new InternalServerErrorFilter());
  app.useGlobalFilters(new BadRequestErrorFilter());
  dotenv.config();

  await app.listen(3000);
}
bootstrap();
