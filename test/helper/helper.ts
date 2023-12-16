import { CreateBlogDto } from '../../src/blog/dto/blog.dto';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { CreatePostForBlogDto } from '../../src/post/dto/post.dto';
import { BlogViewModels } from '../../src/blog/models/blog.view.models';

export class TestingBlog {
  constructor(private readonly server: any) {}

  async createBlog() {
    const blogData: CreateBlogDto = {
      name: faker.lorem.word({ length: 10 }),
      description: faker.lorem.word({ length: 10 }),
      websiteUrl: faker.internet.url(),
    };
    const response = await request(this.server)
      .post('/blogs')
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(blogData);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(String),
      name: blogData.name,
      description: blogData.description,
      websiteUrl: blogData.websiteUrl,
      createdAt: expect.any(String),
      isMembership: false,
    });

    return response.body;
  }
}

export class TestingPost {
  constructor(private readonly server: any) {}
  async createPost(blog: BlogViewModels) {
    const postData: CreatePostForBlogDto = {
      title: faker.lorem.word({ length: 10 }),
      shortDescription: faker.lorem.word({ length: 10 }),
      content: faker.lorem.word({ length: 10 }),
      blogId: blog.id,
    };
    const response = await request(this.server)
      .post('/posts')
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(postData);

    expect(response.status).toBe(201);

    return response.body;
  }
}
