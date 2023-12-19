import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { TestingBlog, TestingPost } from './helper/helper';
import { createApp } from '../src/config/create-app';
import { BlogViewModels } from '../src/blog/models/blog.view.models';
import { PostViewModels } from '../src/post/models/post.view.models';
import { faker } from '@faker-js/faker';

describe('posts', () => {
  let app: INestApplication;
  let server;
  let testingBlog: TestingBlog;
  let testingPost: TestingPost;
  let newBlog: BlogViewModels;
  let newPost1: PostViewModels;
  let newPost2: PostViewModels;

  beforeAll(async () => {
    const modulePost: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modulePost.createNestApplication();
    app = createApp(app);
    await app.init();
    server = app.getHttpServer();
    testingBlog = new TestingBlog(server);
    testingPost = new TestingPost(server);
  });

  afterAll(async () => {
    await app.close();
    await server.close();
  });
  describe('DELETE ALL', () => {
    it('delete all post', async () => {
      const response = await request(server).delete('/testing/all-data');
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
  });

  describe('POST', () => {
    it('no data available posts, 400', async () => {
      const errors = {
        errorsMessages: [
          {
            message: expect.any(String),
            field: 'title',
          },
          {
            message: expect.any(String),
            field: 'shortDescription',
          },
          {
            message: expect.any(String),
            field: 'content',
          },
          {
            message: expect.any(String),
            field: 'blogId',
          },
          {
            message: expect.any(String),
            field: 'blogId',
          },
        ],
      };

      const response = await request(server)
        .post('/posts')
        .auth('admin', 'qwerty')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual(errors);
    });
    it('data is empty posts, 400', async () => {
      const newPost = {
        title: '',
        shortDescription: '',
        content: '',
        blogId: '',
      };
      const errors = {
        errorsMessages: [
          {
            message: expect.any(String),
            field: 'title',
          },
          {
            message: expect.any(String),
            field: 'shortDescription',
          },
          {
            message: expect.any(String),
            field: 'content',
          },
          {
            message: expect.any(String),
            field: 'blogId',
          },
          {
            message: expect.any(String),
            field: 'blogId',
          },
        ],
      };

      const response = await request(server)
        .post('/posts')
        .auth('admin', 'qwerty')
        .send(newPost);

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual(errors);
    });

    it('create blog correct data, 200', async () => {
      newBlog = await testingBlog.createBlog();
      const response = await request(server).get('/blogs');
      expect(response.status).toBe(200);
    });
    it('create post correct data, 201', async () => {
      newPost1 = await testingPost.createPost(newBlog);
      const response = await request(server).get('/posts');
      expect(response.status).toBe(200);
    });
    it('create post correct data, 201', async () => {
      newPost2 = await testingPost.createPost(newBlog);
      const response = await request(server).get('/posts');
      expect(response.status).toBe(200);
    });
  });
  describe('GET', () => {
    it('pagination: sortBy: createdAt, sortDirection: desc, pageNumber: 1, pageSize: 10', async () => {
      const response = await request(server).get(`/posts`).query({
        sortBy: 'createdAt',
        sortDirection: 'desc',
        pageNumber: 1,
        pageSize: 10,
      });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 2,
        items: expect.any(Array),
      });
    });
    it('pagination: sortBy: createdAt, sortDirection: asc, pageNumber: 1, pageSize: 10', async () => {
      const response = await request(server).get(`/posts`).query({
        sortBy: 'createdAt',
        sortDirection: 'asc',
        pageNumber: 1,
        pageSize: 10,
      });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 2,
        items: expect.any(Array),
      });
    });
  });
  describe('PUT', () => {
    it('Unauthorized, 401', async () => {
      const response = await request(server).put(`/posts/-1`);
      expect(response.status).toBe(401);
    });
    it('no data available posts, 400', async () => {
      const errors = {
        errorsMessages: [
          {
            message: expect.any(String),
            field: 'title',
          },
          {
            message: expect.any(String),
            field: 'shortDescription',
          },
          {
            message: expect.any(String),
            field: 'content',
          },
          {
            message: expect.any(String),
            field: 'blogId',
          },
          {
            message: expect.any(String),
            field: 'blogId',
          },
        ],
      };

      const response = await request(server)
        .put(`/posts/${newPost2.id}`)
        .auth('admin', 'qwerty')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual(errors);
    });

    it('data is empty posts, 400', async () => {
      const newPost = {
        title: '',
        shortDescription: '',
        content: '',
        blogId: newBlog.id,
      };
      const errors = {
        errorsMessages: [
          {
            message: expect.any(String),
            field: 'title',
          },
          {
            message: expect.any(String),
            field: 'shortDescription',
          },
          {
            message: expect.any(String),
            field: 'content',
          },
        ],
      };

      const response = await request(server)
        .put(`/posts/${newPost2.id}`)
        .auth('admin', 'qwerty')
        .send(newPost);
      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual(errors);
    });

    it('update post, 204', async () => {
      const updatePost = {
        title: faker.lorem.word({ length: 10 }),
        shortDescription: faker.lorem.word({ length: 10 }),
        content: faker.lorem.word({ length: 10 }),
        blogId: newBlog.id,
      };
      const response = await request(server)
        .put(`/posts/${newPost1.id}`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send(updatePost);
      expect(response.status).toBe(204);

      const responseGet = await request(server)
        .get(`/posts/${newPost1.id}`)
        .auth('admin', 'qwerty', { type: 'basic' });
      expect(responseGet.status).toBe(200);
      expect(responseGet.body).toEqual({
        ...newPost1,
        title: updatePost.title,
        shortDescription: updatePost.shortDescription,
        content: updatePost.content,
        blogId: newBlog.id,
      });
    });
  });
  describe('GET => :id', () => {
    it('post not exist, 404', async () => {
      const response = await request(server)
        .delete(`/posts/-1`)
        .auth('admin', 'qwerty', { type: 'basic' });

      expect(response.status).toBe(404);
    });
    it('get postId, 200', async () => {
      const response = await request(server).get(`/posts/${newPost2.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(newPost2);
    });
  });
  describe('DELETE', () => {
    it('Unauthorized, 401', async () => {
      const response = await request(server).delete(`/posts/-1`);

      expect(response.status).toBe(401);
    });
    it('post not exist, 404', async () => {
      const response = await request(server)
        .delete(`/posts/-1`)
        .auth('admin', 'qwerty', { type: 'basic' });

      expect(response.status).toBe(404);
    });
    it('delete blog, 204', async () => {
      const responseGetBefore = await request(server)
        .get(`/posts/${newPost1.id}`)
        .auth('admin', 'qwerty', { type: 'basic' });
      expect(responseGetBefore.status).toBe(200);

      const responseDelete = await request(server)
        .delete(`/posts/${newPost1.id}`)
        .auth('admin', 'qwerty', { type: 'basic' });
      expect(responseDelete.status).toBe(204);

      const responseGetAfter = await request(server)
        .get(`/posts/${newPost1.id}`)
        .auth('admin', 'qwerty', { type: 'basic' });
      expect(responseGetAfter.status).toBe(404);
    });
  });

  describe('POST => :id/comments', () => {
    it('', async () => {});
  });
  describe('GET => :id/comments', () => {
    it('', async () => {});
  });
  describe('PUT => id/like-status', () => {
    it('', async () => {});
  });
});
