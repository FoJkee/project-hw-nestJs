import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../models/post.schema';
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

    const post = await this.PostModel.find({}, { _id: 0, __v: 0 })
      .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize);

    const countDocument = await this.PostModel.countDocuments({});

    return {
      pagesCount: Math.ceil(countDocument / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: countDocument,
      items: post,
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
