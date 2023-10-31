import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './models/post.schema';
import { PostService } from './infrastructure/post.service';
import { PostController } from './infrastructure/post.controller';
import { Blog, BlogSchema } from '../blog/models/blog.schema';
import { BlogService } from '../blog/infrastructure/blog.service';
import { BlogRepository } from '../blog/infrastructure/blog.repository';
import { PostRepository } from './infrastructure/post.repository';
import { BlogQueryRepository } from '../blog/infrastructure/blog.query.repository';
import { PostQueryRepository } from './infrastructure/post.query.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  controllers: [PostController],
  providers: [
    PostService,
    BlogService,
    BlogRepository,
    PostRepository,
    BlogQueryRepository,
    PostQueryRepository,
  ],
})
export class PostModule {}
