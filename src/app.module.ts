import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER } from '@nestjs/core';
import { AppRoutingModule } from './app-routing.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseConfigService } from './services/mongoose.service';
import { GlobalModule } from './modules/global.module';
import { CommandModule } from 'nestjs-command';
import { SeederModule } from './modules/seeder.module';
import { CustomErrorFilter } from './helpers/filters/custom-error.filter';

@Module({
  imports: [
    AppRoutingModule,
    GlobalModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    CommandModule,
    SeederModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CustomErrorFilter,
    },
  ],
})
export class AppModule {}
