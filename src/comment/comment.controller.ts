import { Controller, Get, Param } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':commentId')
  async getCommentsId(@Param('commentId') commentId: string) {
    return this.commentService.getCommentsId(commentId);
  }
}
