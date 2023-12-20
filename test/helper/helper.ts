import { CreateBlogDto } from '../../src/blog/dto/blog.dto';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { CreatePostForBlogDto } from '../../src/post/dto/post.dto';
import { BlogViewModels } from '../../src/blog/models/blog.view.models';

export class TestingBlog {
  constructor(private readonly server: any) {}

  async createBlog() {
    const blogData: CreateBlogDto = {
      // name: faker.lorem.word({ length: 10 }),
      name: 'AA',
      // description: faker.lorem.word({ length: 10 }),
      description: 'AA',
      // websiteUrl: faker.internet.url(),
      websiteUrl: 'aaaaaaa.com',
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
  async createBlogForPagination() {
    const blogData1: CreateBlogDto = {
      name: 'Kalendula',
      description: 'Kalendulaaaaaa',
      websiteUrl: 'abcdefd.com',
    };
    const response = await request(this.server)
      .post('/blogs')
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(blogData1);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(String),
      name: blogData1.name,
      description: blogData1.description,
      websiteUrl: blogData1.websiteUrl,
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

export class TestingUser {
  constructor(private readonly server: any) {}

  async createUser() {
    const userData = {
      login: faker.lorem.word({ length: 10 }),
      password: faker.lorem.word({ length: 10 }),
      email: faker.internet.email(),
    };

    const response = await request(this.server)
      .post('/users')
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(String),
      login: userData.login,
      email: userData.email,
      createdAt: expect.any(String),
    });

    return response.body;
  }
  async createUserForPagination() {
    const userData1 = {
      login: 'kuraga',
      password: '1234567',
      email: 'abelardo@gmail.com',
    };

    const response = await request(this.server)
      .post('/users')
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(userData1);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(String),
      login: userData1.login,
      email: userData1.email,
      createdAt: expect.any(String),
    });
    return response.body;
  }
}
