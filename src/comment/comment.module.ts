import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './models/comment.schema';
import { CommentRepository } from './infrastructure/comment.repository';
import { CommentController } from './infrastructure/comment.controller';
import { CommentService } from './infrastructure/comment.service';
import { Reaction, ReactionSchema } from '../reaction/models/reaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([
      { name: Reaction.name, schema: ReactionSchema },
    ]),
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
})
export class CommentModule {}
