import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { CommentService } from './comment.service';
import { User } from '../../decorators/user.decorator';
import { UserEntity } from '../../user/models/user.schema';
import { CommentDto } from '../dto/comment.dto';
import { Reaction } from '../../reaction/dto/reaction.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':commentId')
  async getCommentsId(@Param('commentId') commentId: string) {
    return this.commentService.getCommentsId(commentId);
  }

  @Delete(':commentId')
  async deleteCommentId(
    @Param('commentId') commentId: string,
    @User() user: UserEntity,
  ) {
    return this.commentService.deleteCommentId(commentId, user.id);
  }

  @Put(':commentId')
  async updateCommentId(
    @Param('commentId') commentId: string,
    @Body() commentDto: CommentDto,
    @User() user: UserEntity,
  ) {
    return this.commentService.updateCommentId(
      commentDto.content,
      commentId,
      user.id,
    );
  }

  @Put(':commentId/like-status')
  async updateCommentIdLikeStatus(
    @Param('commentId') commentId: string,
    @Body() likeStatusDto: Reaction,
    @User() user: UserEntity,
  ) {
    return this.commentService.updateCommentIdLikeStatus(
      user.id,
      user.login,
      commentId,
      likeStatusDto.likeStatus,
    );
  }
}
