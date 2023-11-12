import { CommentatorInfo, LikesInfo } from './comment.schema';
import { randomUUID } from 'crypto';

export class CommentViewModels {
  constructor(
    public id: string = randomUUID(),
    public postId: string,
    public content: string,
    public commentatorInfo: CommentatorInfo,
    public createdAt: string = new Date().toISOString(),
    public likesInfo: LikesInfo,
  ) {}
}
