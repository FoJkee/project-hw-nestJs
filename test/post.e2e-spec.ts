import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { TestingBlog, TestingPost } from './helper/helper';
import { createApp } from '../src/config/create-app';
import { BlogViewModels } from '../src/blog/models/blog.view.models';
import { PostViewModels } from '../src/post/models/post.view.models';

describe('posts', () => {
  let app: INestApplication;
  let server;
  let testingBlog: TestingBlog;
  let testingPost: TestingPost;
  let newBlog: BlogViewModels;
  let newPost1: PostViewModels;
  let newPost2: PostViewModels;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app = createApp(app);
    await app.init();
    server = app.getHttpServer();
    testingBlog = new TestingBlog(server);
    testingPost = new TestingPost(server);

    app = module.createNestApplication();
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
    it('incorrect data', async () => {});
    it('create blog correct data, 200', async () => {
      newBlog = await testingBlog.createBlog();
      const response = await request(server).get('/blogs');
      expect(response.body.items).toEqual([newBlog]);
    });
    it('create post correct data', async () => {
      newPost1 = await testingPost.createPost(newBlog);
      const response = await request(server).get('/posts');
      expect(response.status).toBe(200);
    });
    it('create post correct data', async () => {
      newPost2 = await testingPost.createPost(newBlog);
      const response = await request(server).get('/posts');
      expect(response.status).toBe(200);
    });
  });
});
