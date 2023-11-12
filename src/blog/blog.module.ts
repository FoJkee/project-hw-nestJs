import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './models/blog.schema';
import { BlogController } from './infrastructure/blog.controller';
import { BlogService } from './infrastructure/blog.service';
import { Post, PostSchema } from '../post/models/post.schema';
import { PostService } from '../post/infrastructure/post.service';
import { BlogRepository } from './infrastructure/blog.repository';
import { PostRepository } from '../post/infrastructure/post.repository';
import { BlogQueryRepository } from './infrastructure/blog.query.repository';
import { PostQueryRepository } from '../post/infrastructure/post.query.repository';
import { Comment, CommentSchema } from '../comment/models/comment.schema';
import { CommentRepository } from '../comment/infrastructure/comment.repository';
import { Reaction, ReactionSchema } from '../reaction/models/reaction.schema';
import { UserRepository } from '../user/infrastructure/user.repository';
import { UserEntity, UserSchema } from '../user/models/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([
      { name: Reaction.name, schema: ReactionSchema },
    ]),
    MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }]),
  ],
  controllers: [BlogController],
  providers: [
    BlogService,
    PostService,
    BlogRepository,
    PostRepository,
    BlogQueryRepository,
    PostQueryRepository,
    CommentRepository,
    UserRepository,
  ],
})
export class BlogModule {}
