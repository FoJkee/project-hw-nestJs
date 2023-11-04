import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from '../models/post.schema';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { CreatePostDto } from '../dto/post.dto';
import { CommentViewModels } from '../../comment/models/comment.view.models';
import { BlogService } from '../../blog/infrastructure/blog.service';
import { PostRepository } from './post.repository';
import { BlogRepository } from '../../blog/infrastructure/blog.repository';
import { PostQueryRepository } from './post.query.repository';
import { PaginationView } from '../../pagination/pagination';
import { myStatusView, PostViewModels } from '../models/post.view.models';
import { QueryDto } from '../../pagination/pagination.query.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly blogRepository: BlogRepository,
    private readonly blogService: BlogService,
    private readonly postQueryRepository: PostQueryRepository,
  ) {}

  async getPosts(
    queryDto: QueryDto,
  ): Promise<PaginationView<PostViewModels[]>> {
    return this.postQueryRepository.getPosts(queryDto);
  }

  async createPost(
    createPostDto: CreatePostDto,
    blogId: string,
    blogName: string,
  ): Promise<PostViewModels | null> {
    const newPost: Post = {
      id: randomStringGenerator(),
      title: createPostDto.title,
      shortDescription: createPostDto.shortDescription,
      content: createPostDto.content,
      blogId,
      blogName,
      createdAt: new Date().toISOString(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: myStatusView.None,
        newestLikes: [],
      },
    };
    await this.postRepository.createPost(newPost);
    return newPost;
  }

  async updatePostId(
    postId: string,
    createPostDto: CreatePostDto,
  ): Promise<boolean> {
    const result = await this.postRepository.updatePostId(
      postId,
      createPostDto,
    );
    if (!result) throw new NotFoundException();
    return result;
  }

  async getPostId(postId: string): Promise<PostViewModels | null> {
    const result = await this.postRepository.getPostId(postId);
    if (!result) throw new NotFoundException();
    return result;
  }

  async deletePostId(postId: string): Promise<boolean> {
    const result = await this.postRepository.deletePostId(postId);
    if (!result) throw new NotFoundException();
    return result;
  }

  async getCommentForPost(
    queryDto: QueryDto,
    postId: string,
  ): Promise<PaginationView<CommentViewModels[]>> {
    return this.postQueryRepository.getCommentForPost(queryDto, postId);
  }
}
