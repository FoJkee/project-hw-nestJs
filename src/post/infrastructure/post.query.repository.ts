import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../models/post.schema';
import { Model, Promise } from 'mongoose';
import { pagination, PaginationView } from '../../pagination/pagination';
import { PostViewModels } from '../models/post.view.models';
import { Comment, CommentDocument } from '../../comment/models/comment.schema';
import { QueryDto } from '../../pagination/pagination.query.dto';
import { CommentViewModels } from '../../comment/models/comment.view.models';
import { PostRepository } from './post.repository';
import { ReactionRepository } from '../../reaction/infrastructure/reaction.repository';
import { CommentRepository } from '../../comment/infrastructure/comment.repository';

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

    const post = await this.PostModel.find({}, { _id: 0, __v: 0 })
      .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize);

    // const result = post.map(async (post) => {
    //   if (userId) {
    // const userLike = await this.postRepository.getUserLikePost(
    //       post.id,
    //       userId,
    //     );
    //     if (userLike) {
    //       post.extendedLikesInfo.myStatus = userLike.status;
    //     }
    //
    //     const newestLike = await this.reactionRepository.newestLike(post.id, 3);
    //     const newestLikeMap = newestLike.map((el) => ({
    //       addedAt: el.createAt,
    //       userId: el.userId,
    //       login: el.userLogin,
    //     }));
    //     return {
    //       ...post,
    //       extendedLikesInfo: {
    //         ...post.extendedLikesInfo,
    //         newestLikes: newestLikeMap,
    //       },
    //     };
    //   }
    //   return Promise.all(result);
    // });

    const getPosts = post.map((el) => ({
      id: el.id,
      title: el.title,
      shortDescription: el.shortDescription,
      content: el.content,
      blogId: el.blogId,
      blogName: el.blogName,
      createdAt: el.createdAt,
      extendedLikesInfo: {
        likesCount: el.extendedLikesInfo.likesCount,
        dislikesCount: el.extendedLikesInfo.dislikesCount,
        myStatus: el.extendedLikesInfo.myStatus,
        newestLikes: el.extendedLikesInfo.newestLikes.map((post) => ({
          addedAt: post.addedAt,
          userId: post.userId,
          login: post.login,
        })),
      },
    }));

    const countDocument = await this.PostModel.countDocuments();

    return {
      pagesCount: Math.ceil(countDocument / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: countDocument,
      items: getPosts,
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
      .limit(pageSize);

    await comment.map(async (comment) => {
      if (userId) {
        const findUserLikeStatus =
          await this.commentRepository.getUserLikeComment(comment.id, userId);
        if (findUserLikeStatus) {
          comment.likesInfo.myStatus = findUserLikeStatus.status;
        }
      }
    });

    const countDocument = await this.CommentModel.countDocuments(filter);

    return {
      pagesCount: Math.ceil(countDocument / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: countDocument,
      items: comment,
    };
  }
}
