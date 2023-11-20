import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from './blog/blog.module';
import { TestingModule } from './testing/testing.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';
import { AuthService } from './auth/infrastructure/auth.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { SecurityDevicesModule } from './security-devices/security-devices.module';
import { UserService } from './user/infrastructure/user.service';
import { JwtService } from './auth/jwt/jwt';
import { SecurityDevicesService } from './security-devices/infractructure/security-devices.service';
import { EmailService } from './email/email.service';
import { UserRepository } from './user/infrastructure/user.repository';
import { UserQueryRepository } from './user/infrastructure/user.query.repository';
import { SecurityDevicesRepository } from './security-devices/infractructure/security-devices.repository';
import { UserEntity, UserSchema } from './user/models/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongo_uri'),
      }),
    }),
    MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }]),
    BlogModule,
    TestingModule,
    PostModule,
    CommentModule,
    UserModule,
    AuthModule,
    SecurityDevicesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    UserService,
    JwtService,
    SecurityDevicesService,
    EmailService,
    UserRepository,
    UserQueryRepository,
    SecurityDevicesRepository,
  ],
})
export class AppModule {}
