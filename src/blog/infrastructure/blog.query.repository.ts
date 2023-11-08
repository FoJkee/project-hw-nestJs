import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../models/blog.schema';
import { Model } from 'mongoose';
import { BlogQueryDto } from '../dto/blog.query.dto';
import { pagination, PaginationView } from '../../pagination/pagination';
import { BlogViewModels } from '../models/blog.view.models';
import { QueryDto } from '../../pagination/pagination.query.dto';
import { Post, PostDocument } from '../../post/models/post.schema';
import { PostViewModels } from '../../post/models/post.view.models';

export class BlogQueryRepository {
  constructor(
    @InjectModel(Blog.name) private readonly BlogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private readonly PostModel: Model<PostDocument>,
  ) {}

  async getBlogs(
    blogQueryDto: BlogQueryDto,
  ): Promise<PaginationView<BlogViewModels[]>> {
    const searchNameTerm = blogQueryDto.searchNameTerm
      ? blogQueryDto.searchNameTerm.toString()
      : '';

    const { sortBy, pageSize, pageNumber, sortDirection } =
      pagination(blogQueryDto);

    const filter = { name: { $regex: searchNameTerm, $options: 'i' } };

    const blog = await this.BlogModel.find(filter, { _id: 0, __v: 0 })
      .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize);

    const countDocument: number = await this.BlogModel.countDocuments(filter);

    return {
      pagesCount: Math.ceil(countDocument / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: countDocument,
      items: blog,
    };
  }
  async getPostForBlog(
    queryDto: QueryDto,
    blogId: string,
  ): Promise<PaginationView<PostViewModels[]>> {
    const { pageSize, pageNumber, sortDirection, sortBy } =
      pagination(queryDto);

    const filter = { blogId };

    const post = await this.PostModel.find(filter, {
      _id: 0,
      __v: 0,
      extendedLikesInfo: { _id: 0 },
    })
      .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      .lean();

    const countDocument = await this.PostModel.countDocuments(filter);

    return {
      pagesCount: Math.ceil(countDocument / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: countDocument,
      items: post,
    };
  }
}
