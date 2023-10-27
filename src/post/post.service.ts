import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './models/post.schema';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from '../blog/models/blog.schema';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { CreatePostDto } from './dto/post.dto';
import { myStatusView, PostViewModels } from './models/post.view.models';
import { BlogService } from '../blog/blog.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private PostModel: Model<PostDocument>,
    @InjectModel(Blog.name) private BlogModel: Model<BlogDocument>,
    private blogService: BlogService,
  ) {}

  async getPosts(): Promise<PostViewModels[]> {
    return this.PostModel.find();
  }

  async createPost(
    createPostDto: CreatePostDto,
    blogId: string,
  ): Promise<PostViewModels> {
    const blog = await this.blogService.findBlogId(blogId);
    const blogName = blog!.name;

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
    const result = await this.PostModel.create(newPost);
    if (!result) throw new BadRequestException();
    return newPost;
  }

  async updatePostId(
    postId: string,
    createPostDto: CreatePostDto,
  ): Promise<boolean> {
    try {
      await this.PostModel.findOneAndUpdate(
        { id: postId },
        { $set: createPostDto },
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  async getPostId(postId: string): Promise<PostViewModels | null> {
    return this.PostModel.findOne({ id: postId }, { __v: 0, _id: 0 });
  }

  async deletePostId(postId: string): Promise<boolean> {
    try {
      await this.PostModel.findOneAndDelete({ id: postId });
      return true;
    } catch (e) {
      return false;
    }
  }
}
