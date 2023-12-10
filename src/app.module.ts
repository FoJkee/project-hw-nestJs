import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/infrastructure/auth.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user/infrastructure/user.service';
import { SecurityDevicesService } from './security-devices/infractructure/security-devices.service';
import { EmailService } from './email/email.service';
import { UserRepository } from './user/infrastructure/user.repository';
import { UserQueryRepository } from './user/infrastructure/user.query.repository';
import { SecurityDevicesRepository } from './security-devices/infractructure/security-devices.repository';
import { UserEntity, UserSchema } from './user/models/user.schema';
import { Device, DeviceSchema } from './security-devices/models/device.schema';
import { BlogRepository } from './blog/infrastructure/blog.repository';
import { PostRepository } from './post/infrastructure/post.repository';
import { BlogQueryRepository } from './blog/infrastructure/blog.query.repository';
import { PostQueryRepository } from './post/infrastructure/post.query.repository';
import { CommentRepository } from './comment/infrastructure/comment.repository';
import { ReactionRepository } from './reaction/infrastructure/reaction.repository';
import { BlogService } from './blog/infrastructure/blog.service';
import { CommentService } from './comment/infrastructure/comment.service';
import { PostService } from './post/infrastructure/post.service';
import { TestingService } from './testing/testing.service';
import { UserController } from './user/infrastructure/user.controller';
import { TestingController } from './testing/testing.controller';
import { SecurityDevicesController } from './security-devices/infractructure/security-devices.controller';
import { PostController } from './post/infrastructure/post.controller';
import { CommentController } from './comment/infrastructure/comment.controller';
import { BlogController } from './blog/infrastructure/blog.controller';
import { AuthController } from './auth/infrastructure/auth.controller';
import { Blog, BlogSchema } from './blog/models/blog.schema';
import { Post, PostSchema } from './post/models/post.schema';
import { Comment, CommentSchema } from './comment/models/comment.schema';
import { Reaction, ReactionSchema } from './reaction/models/reaction.schema';
import { MongooseConfigService } from './config/mongoose.config';
import { BasicAuthGuard } from './guard/basic.auth.guard';
import { EmailValidator, LoginValidator } from './user/dto/user.validator';
import { JwtService } from '@nestjs/jwt';
import { JwtServicess } from './auth/jwt/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerConfigService } from './config/mailer.config';
import { BlogValidator } from './validators/blog.validator';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerConfigService } from './config/throttle.config';

const repositories = [
  BlogRepository,
  PostRepository,
  BlogQueryRepository,
  PostQueryRepository,
  CommentRepository,
  UserRepository,
  ReactionRepository,
  SecurityDevicesRepository,
  UserQueryRepository,
];

const services = [
  AuthService,
  JwtServicess,
  BlogService,
  CommentService,
  EmailService,
  PostService,
  SecurityDevicesService,
  TestingService,
  UserService,
  AppService,
  JwtService,
];

const settings = [
  BasicAuthGuard,
  LoginValidator,
  EmailValidator,
  BlogValidator,
];

const controllers = [
  AppController,
  UserController,
  TestingController,
  SecurityDevicesController,
  PostController,
  CommentController,
  BlogController,
  AuthController,
];

const schemas = [
  { name: Blog.name, schema: BlogSchema },
  { name: Post.name, schema: PostSchema },
  { name: Comment.name, schema: CommentSchema },
  { name: Reaction.name, schema: ReactionSchema },
  { name: UserEntity.name, schema: UserSchema },
  { name: Device.name, schema: DeviceSchema },
];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRootAsync({ useClass: MongooseConfigService }),
    MailerModule.forRootAsync({ useClass: MailerConfigService }),
    // ThrottlerModule.forRootAsync({ useClass: ThrottlerConfigService }),
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 5,
      },
    ]),
    MongooseModule.forFeature(schemas),
  ],
  controllers: [...controllers],
  providers: [...services, ...repositories, ...settings],
})
export class AppModule {}
