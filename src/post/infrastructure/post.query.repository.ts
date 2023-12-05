import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../models/post.schema';
import { Model } from 'mongoose';
import { pagination, PaginationView } from '../../pagination/pagination';
import { Comment, CommentDocument } from '../../comment/models/comment.schema';
import { QueryDto } from '../../pagination/pagination.query.dto';
import { CommentViewModels } from '../../comment/models/comment.view.models';
import { PostRepository } from './post.repository';
import { ReactionRepository } from '../../reaction/infrastructure/reaction.repository';
import { CommentRepository } from '../../comment/infrastructure/comment.repository';
import { myStatusView, PostViewModels } from '../models/post.view.models';

export class PostQueryRepository {
  constructor(
    @InjectModel(Post.name) private readonly PostModel: Model<PostDocument>,
    @InjectModel(Comment.name)
    private readonly CommentModel: Model<CommentDocument>,
    private readonly postRepository: PostRepository,
    private readonly reactionRepository: ReactionRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  async getPosts(
    queryDto: QueryDto,
    userId: string,
  ): Promise<PaginationView<PostViewModels[]>> {
    const { sortBy, pageSize, pageNumber, sortDirection } =
      pagination(queryDto);

    const post = await this.PostModel.find(
      {},
      { _id: 0, __v: 0, 'extendedLikesInfo._id': 0 },
    )
      .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      .lean();

    const items = await Promise.all(
      post.map(async (el) => {
        let myStatus = myStatusView.None;
        if (userId) {
          const userLikePost = await this.postRepository.getUserLikePost(
            el.id,
            userId,
          );
          if (userLikePost) {
            myStatus = el.extendedLikesInfo.myStatus
              ? userLikePost.status
              : myStatusView.None;
          }
        }
        const newestLike = await this.reactionRepository.newestLike(el.id, 3);

        const newestLikeMap = newestLike.map((el) => ({
          addedAt: el.createdAt,
          userId: el.userId,
          login: el.userLogin,
        }));

        return {
          ...el,
          extendedLikesInfo: {
            ...el.extendedLikesInfo,
            myStatus: myStatus,
            newestLikes: newestLikeMap,
          },
        };
      }),
    );

    const countDocument = await this.PostModel.countDocuments();

    return {
      pagesCount: Math.ceil(countDocument / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: countDocument,
      items: items,
    };
  }

  async getCommentForPost(
    queryDto: QueryDto,
    postId: string,
    userId: string | null,
  ): Promise<PaginationView<CommentViewModels[]>> {
    const { sortBy, sortDirection, pageSize, pageNumber } =
      pagination(queryDto);

    const filter = { postId };

    const comment = await this.CommentModel.find(filter, {
      _id: 0,
      __v: 0,
      postId: 0,
      'commentatorInfo._id': 0,
      'likesInfo._id': 0,
    })
      .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      .lean();

    const result = await Promise.all(
      comment.map(async (com) => {
        let myStatus = myStatusView.None;
        if (userId) {
          const findUserLikeStatus =
            await this.commentRepository.getUserLikeComment(com.id, userId);
          if (findUserLikeStatus)
            myStatus = com.likesInfo.myStatus
              ? findUserLikeStatus.status
              : myStatusView.None;
        }
        return { ...com, likesInfo: { ...com.likesInfo, myStatus: myStatus } };
      }),
    );

    const countDocument = await this.CommentModel.countDocuments(filter);

    return {
      pagesCount: Math.ceil(countDocument / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: countDocument,
      items: result,
    };
  }
}
