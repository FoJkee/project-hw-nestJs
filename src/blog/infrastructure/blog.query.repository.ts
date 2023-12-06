import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../models/blog.schema';
import { Model } from 'mongoose';
import { BlogQueryDto } from '../dto/blog.query.dto';
import { pagination, PaginationView } from '../../pagination/pagination';
import { BlogViewModels } from '../models/blog.view.models';
import { QueryDto } from '../../pagination/pagination.query.dto';
import { Post, PostDocument } from '../../post/models/post.schema';
import {
  myStatusView,
  PostViewModels,
} from '../../post/models/post.view.models';
import { ReactionRepository } from '../../reaction/infrastructure/reaction.repository';
import { PostRepository } from '../../post/infrastructure/post.repository';
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class BlogQueryRepository {
  constructor(
    @InjectModel(Blog.name) private readonly BlogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private readonly PostModel: Model<PostDocument>,
    private readonly reactionRepository: ReactionRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async getBlogs(
    blogQueryDto: BlogQueryDto,
  ): Promise<PaginationView<BlogViewModels[]>> {
    const searchNameTerm = blogQueryDto.searchNameTerm
      ? blogQueryDto.searchNameTerm.toString()
      : '';
    const { sortBy, pageSize, pageNumber, sortDirection } =
      pagination(blogQueryDto);

    const filter = {
      name: { $regex: searchNameTerm, $options: 'i' },
    };

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
    userId: string | null,
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

    const items = await Promise.all(
      post.map(async (el) => {
        let myStatus = myStatusView.None;

        if (userId) {
          const userLikePost = await this.postRepository.getUserLikePost(
            el.id,
            userId,
          );

          myStatus = userLikePost ? userLikePost.status : myStatusView.None;
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
            myStatus,
            newestLikes: newestLikeMap,
          },
        };
      }),
    );

    return {
      pagesCount: Math.ceil(countDocument / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: countDocument,
      items,
    };
  }
}
