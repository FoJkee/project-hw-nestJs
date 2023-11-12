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
import { Comment, CommentSchema } from '../comment/models/comment.schema';
import { CommentService } from '../comment/infrastructure/comment.service';
import { CommentRepository } from '../comment/infrastructure/comment.repository';
import { CommentController } from '../comment/infrastructure/comment.controller';
import { Reaction, ReactionSchema } from '../reaction/models/reaction.schema';
import { UserRepository } from '../user/infrastructure/user.repository';
import { UserEntity, UserSchema } from '../user/models/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([
      { name: Reaction.name, schema: ReactionSchema },
    ]),
    MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }]),
  ],
  controllers: [PostController, CommentController],
  providers: [
    PostService,
    BlogService,
    BlogRepository,
    PostRepository,
    BlogQueryRepository,
    PostQueryRepository,
    CommentService,
    CommentRepository,
    UserRepository,
  ],
})
export class PostModule {}
