import { LikesInfo } from './comment.schema';

export class CommentViewModels {
  constructor(
    public id: string,
    public postId: string,
    public content: string,
    public commentatorInfo: {
      userId: string;
      userLogin: string;
    },
    public createdAt: string = new Date().toISOString(),
    public likesInfo: LikesInfo,
  ) {}
}
