import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from './blog/blog.module';
import { TestingModule } from './testing/testing.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';
import { AuthService } from './auth/infrastructure/auth.service';
import { AuthController } from './auth/infrastructure/auth.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SecurityDevicesService } from './security-devices/infractructure/security-devices.service';
import configuration from './config/configuration';

import dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    BlogModule,
    TestingModule,
    PostModule,
    CommentModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, SecurityDevicesService],
})
export class AppModule {}
