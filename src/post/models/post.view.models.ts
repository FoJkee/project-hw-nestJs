import { randomUUID } from 'crypto';

export class PostViewModels {
  constructor(
    public id: string = randomUUID(),
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: string = new Date().toISOString(),
    public extendedLikesInfo: extendedLikesInfoView,
  ) {}
}

{
}

type extendedLikesInfoView = {
  likesCount: number;
  dislikesCount: number;
  myStatus: myStatusView;
  newestLikes: newestLikesView[];
};

export enum myStatusView {
  None = 'None',
  Like = 'Like',
  DisLike = 'Dislike',
}

type newestLikesView = {
  addedAt: string;
  userId: string;
  login: string;
};
