import { Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async getCommentsId(commentId: string) {
    return this.commentRepository.getCommentsId(commentId);
  }
}
