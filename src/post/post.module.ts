import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './models/post.schema';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Blog, BlogSchema } from '../blog/models/blog.schema';
import { BlogService } from '../blog/blog.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  controllers: [PostController],
  providers: [PostService, BlogService],
})
export class PostModule {}
