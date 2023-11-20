import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { TestingService } from './testing.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from '../blog/models/blog.schema';
import { Post, PostSchema } from '../post/models/post.schema';
import { UserEntity, UserSchema } from '../user/models/user.schema';
import { Device, DeviceSchema } from '../security-devices/models/device.schema';
import { Comment, CommentSchema } from '../comment/models/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  controllers: [TestingController],
  providers: [TestingService],
})
export class TestingModule {}
