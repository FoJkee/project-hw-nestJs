import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { User } from '../../decorators/user.decorator';
import { UserEntity } from '../../user/models/user.schema';
import { CommentDto } from '../dto/comment.dto';
import { Reaction } from '../../reaction/dto/reaction.dto';
import { BearerAuthGuard } from '../../guard/bearer.auth.guard';
import { BearerUserIdGuard } from '../../guard/bearer.userId.guard';
import { UserId } from '../../decorators/userId.decorator';
import { CommentRepository } from './comment.repository';

@Controller('comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly commentRepository: CommentRepository,
  ) {}

  @Get(':commentId')
  @UseGuards(BearerUserIdGuard)
  @HttpCode(200)
  async getCommentsId(
    @Param('commentId') commentId: string,
    @UserId() userId: string | null,
  ) {
    return this.commentService.getCommentsId(commentId, userId);
  }

  @UseGuards(BearerAuthGuard)
  @Delete(':commentId')
  @HttpCode(204)
  async deleteCommentId(
    @Param('commentId') commentId: string,
    @User() user: UserEntity,
  ): Promise<boolean> {
    return this.commentService.deleteCommentId(commentId, user.id);
  }
  @UseGuards(BearerAuthGuard)
  @Put(':commentId')
  @HttpCode(204)
  async updateCommentId(
    @Param('commentId') commentId: string,
    @Body() commentDto: CommentDto,
    @User() user: UserEntity,
  ): Promise<boolean> {
    return this.commentService.updateCommentId(
      commentDto.content,
      commentId,
      user.id,
    );
  }
  @UseGuards(BearerAuthGuard)
  @Put(':commentId/like-status')
  @HttpCode(204)
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
