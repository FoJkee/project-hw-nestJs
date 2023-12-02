import { BadRequestException, Injectable } from '@nestjs/common';
import { Post } from '../models/post.schema';
import { CreatePostDto, CreatePostForBlogDto } from '../dto/post.dto';
import { CommentViewModels } from '../../comment/models/comment.view.models';
import { BlogService } from '../../blog/infrastructure/blog.service';
import { PostRepository } from './post.repository';
import { BlogRepository } from '../../blog/infrastructure/blog.repository';
import { PostQueryRepository } from './post.query.repository';
import { PaginationView } from '../../pagination/pagination';
import { myStatusView, PostViewModels } from '../models/post.view.models';
import { QueryDto } from '../../pagination/pagination.query.dto';
import { Comment } from '../../comment/models/comment.schema';
import { CommentRepository } from '../../comment/infrastructure/comment.repository';
import { randomUUID } from 'crypto';
import { UserEntity } from '../../user/models/user.schema';
import { CommentDto } from '../../comment/dto/comment.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly blogRepository: BlogRepository,
    private readonly blogService: BlogService,
    private readonly postQueryRepository: PostQueryRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  async getPosts(
    queryDto: QueryDto,
    userId: string,
  ): Promise<PaginationView<PostViewModels[]>> {
    return this.postQueryRepository.getPosts(queryDto, userId);
  }

  async createPost(
    createPostDto: CreatePostDto,
    blogId: string,
    blogName: string,
  ): Promise<PostViewModels | null> {
    const newPost: Post = {
      id: randomUUID(),
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
    const result = await this.postRepository.createPost({ ...newPost });
    if (!result) throw new BadRequestException();
    return newPost;
  }

  async updatePostId(
    postId: string,
    createPostForBlogDto: CreatePostForBlogDto,
  ) {
    return this.postRepository.updatePostId(postId, createPostForBlogDto);
  }

  async getPostId(
    postId: string,
    userId: string | null,
  ): Promise<PostViewModels | null> {
    return await this.postRepository.getPostId(postId, userId);
  }

  async deletePostId(postId: string) {
    return this.postRepository.deletePostId(postId);
  }

  async getCommentForPost(
    queryDto: QueryDto,
    postId: string,
  ): Promise<PaginationView<CommentViewModels[]>> {
    return this.postQueryRepository.getCommentForPost(queryDto, postId);
  }
  async createCommentForPost(
    postId: string,
    user: UserEntity,
    createCommentDto: CommentDto,
  ) {
    const newComment: Comment = {
      id: randomUUID(),
      postId,
      content: createCommentDto.content,
      commentatorInfo: {
        userId: user.id,
        userLogin: user.login,
      },
      createdAt: new Date().toISOString(),
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: myStatusView.None,
      },
    };

    await this.commentRepository.createCommentForPost(newComment);
    return newComment;
  }

  async updatePostIdLikeStatus(
    postId: string,
    userId: string,
    userLogin: string,
    status: myStatusView,
  ) {
    return this.postRepository.updatePostIdLikeStatus(
      postId,
      userId,
      userLogin,
      status,
    );
  }
}
