import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './models/blog.schema';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { Post, PostSchema } from '../post/models/post.schema';
import { PostService } from '../post/post.service';
import { BlogRepository } from './blog.repository';
import { PostRepository } from '../post/post.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [BlogController],
  providers: [BlogService, PostService, BlogRepository, PostRepository],
})
export class BlogModule {}
