import { BadRequestException, Injectable } from '@nestjs/common';
import { Post } from './models/post.schema';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { CreatePostDto } from './dto/post.dto';
import { myStatusView, PostViewModels } from './models/post.view.models';
import { BlogService } from '../blog/blog.service';
import { PostRepository } from './post.repository';
import { BlogRepository } from '../blog/blog.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly blogRepository: BlogRepository,
    private blogService: BlogService,
  ) {}

  async getPosts(): Promise<PostViewModels[]> {
    return this.postRepository.getPosts();
  }

  async createPost(
    createPostDto: CreatePostDto,
    blogId: string,
    blogName: string,
  ): Promise<PostViewModels> {
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
    const result = await this.postRepository.createPost(newPost);
    console.log('result', result);
    if (!result) throw new BadRequestException();
    return newPost;
  }

  async updatePostId(
    postId: string,
    createPostDto: CreatePostDto,
  ): Promise<boolean> {
    return this.postRepository.updatePostId(postId, createPostDto);
  }

  async getPostId(postId: string): Promise<PostViewModels | null> {
    return this.postRepository.getPostId(postId);
  }

  async deletePostId(postId: string): Promise<boolean> {
    return this.postRepository.deletePostId(postId);
  }
}
