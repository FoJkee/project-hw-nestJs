import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './models/comment.schema';
import { CommentRepository } from './infrastructure/comment.repository';
import { CommentController } from './infrastructure/comment.controller';
import { CommentService } from './infrastructure/comment.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
})
export class CommentModule {}
