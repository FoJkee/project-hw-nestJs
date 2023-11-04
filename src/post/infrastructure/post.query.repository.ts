import { InjectModel } from '@nestjs/mongoose';
import { extendedLikesInfo, Post, PostDocument } from '../models/post.schema';
import { Model } from 'mongoose';
import { pagination, PaginationView } from '../../pagination/pagination';
import { PostViewModels } from '../models/post.view.models';
import { Comment, CommentDocument } from '../../comment/models/comment.schema';
import { QueryDto } from '../../pagination/pagination.query.dto';
import { CommentViewModels } from '../../comment/models/comment.view.models';

export class PostQueryRepository {
  constructor(
    @InjectModel(Post.name) private readonly PostModel: Model<PostDocument>,
    @InjectModel(Comment.name)
    private readonly CommentModel: Model<CommentDocument>,
  ) {}

  async getPosts(
    queryDto: QueryDto,
  ): Promise<PaginationView<PostViewModels[]>> {
    const { sortBy, pageSize, pageNumber, sortDirection } =
      pagination(queryDto);

    const post = await this.PostModel.find(
      {},
      { _id: 0, __v: 0, extendedLikesInfo: { _id: 0 } },
    )
      .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize);

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
        newestLikes: el.extendedLikesInfo.newestLikes,
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
  ): Promise<PaginationView<CommentViewModels[]>> {
    const { sortBy, sortDirection, pageSize, pageNumber } =
      pagination(queryDto);

    const filter = { postId };

    const comment = await this.CommentModel.find(filter, {
      _id: 0,
      __v: 0,
      postId: 0,
    })
      .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize);

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
