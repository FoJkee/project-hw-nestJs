import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../models/blog.schema';
import { Model } from 'mongoose';
import { BlogQueryDto, QueryDto } from '../dto/blog.query.dto';
import { pagination, PaginationView } from '../../pagination/pagination';
import { BlogViewModels } from '../models/blog.view.models';

export class BlogQueryRepository {
  constructor(
    @InjectModel(Blog.name) private readonly BlogModel: Model<BlogDocument>,
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

    const getBlogs: Blog[] = await blog.map((el) => ({
      id: el.id,
      name: el.name,
      description: el.description,
      websiteUrl: el.websiteUrl,
      createdAt: el.createdAt,
      isMembership: el.isMembership,
    }));

    return {
      pagesCount: Math.ceil(countDocument / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: countDocument,
      items: getBlogs,
    };
  }
}
