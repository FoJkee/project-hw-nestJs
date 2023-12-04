import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { myStatusView } from '../../post/models/post.view.models';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async getCommentsId(commentId: string, userId: string | null) {
    const comment = await this.commentRepository.getCommentsId(commentId);

    if (!comment) throw new NotFoundException();

    if (userId) {
      const userLike = await this.commentRepository.getUserLikeComment(
        commentId,
        userId,
      );
      if (userLike) {
        comment.likesInfo.myStatus = userLike.status;
      }
    }
    return comment;
  }

  async deleteCommentId(commentId: string, userId: string) {
    const comment = await this.commentRepository.getCommentsId(commentId);
    if (!comment) throw new NotFoundException();
    if (comment.commentatorInfo.userId !== userId)
      throw new ForbiddenException();
    return this.commentRepository.deleteCommentId(commentId);
  }

  async updateCommentId(content: string, commentId: string, userId: string) {
    const comment = await this.commentRepository.getCommentsId(commentId);
    if (!comment) throw new NotFoundException();
    if (comment.commentatorInfo.userId !== userId)
      throw new ForbiddenException();
    return this.commentRepository.updateCommentId(content, commentId);
  }

  async updateCommentIdLikeStatus(
    userId: string,
    userLogin: string,
    commentId: string,
    status: myStatusView,
  ) {
    const comment = await this.commentRepository.getCommentsId(commentId);
    if (!comment) throw new NotFoundException();
    return this.commentRepository.updateCommentIdLikeStatus(
      userId,
      userLogin,
      commentId,
      status,
    );
  }
}
