import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../models/post.schema';
import { Model } from 'mongoose';
import { pagination, PaginationView } from '../../pagination/pagination';
import { QueryDto } from '../../blog/dto/blog.query.dto';
import { PostViewModels } from '../models/post.view.models';

export class PostQueryRepository {
  constructor(
    @InjectModel(Post.name) private readonly PostModel: Model<PostDocument>,
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

    const getPost: Post[] = post.map((el) => ({
      id: el.id,
      title: el.title,
      shortDescription: el.shortDescription,
      content: el.content,
      blogId: el.blogId,
      blogName: el.blogName,
      createdAt: el.createdAt,
      extendedLikesInfo: el.extendedLikesInfo,
    }));

    return {
      pagesCount: Math.ceil(countDocument / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: countDocument,
      items: getPost,
    };
  }
}
