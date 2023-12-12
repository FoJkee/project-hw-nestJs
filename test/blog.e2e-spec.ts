import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';

describe('blogs', () => {
  let app: INestApplication;
  let server;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
    await server.close();
  });

  describe('delete all blogs', () => {
    it('should delete all data, status 204', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/testing/all-data',
      );
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    it('return clear pagination', async () => {
      const paginationBlog = {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: [],
      };
      const response = await request(app.getHttpServer()).get('/blogs');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(paginationBlog);
    });
  });
  describe('create blogs', () => {
    it('create blogs, 201', async () => {
      const newBlog = {
        name: 'string',
        description: 'string',
        websiteUrl: 'stringurl.com',
      };
      const response = await request(server)
        .post('/blogs')
        .auth('admin', 'qwerty')
        .send(newBlog);
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: expect.any(String),
        name: newBlog.name,
        description: newBlog.description,
        websiteUrl: newBlog.websiteUrl,
        createdAt: expect.any(String),
        isMembership: false,
      });
    });

    it('incorrect data blogs, 400', async () => {
      const errors = {
        errorsMessages: [
          {
            message: expect.any(String),
            field: 'name',
          },
          {
            message: expect.any(String),
            field: 'description',
          },
          {
            message: expect.any(String),
            field: 'websiteUrl',
          },
        ],
      };

      const response = await request(server)
        .post('/blogs')
        .auth('admin', 'qwerty')
        .send({});
      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual(errors);

      const newBlogError = {
        name: '',
        description: '',
        websiteUrl: '',
      };

      const response1 = await request(server)
        .post('/blogs')
        .auth('admin', 'qwerty')
        .send(newBlogError);
      expect(response1.status).toBe(400);
      expect(response1.body).toStrictEqual(errors);
    });

    // const response1 = await request(server).post('/blogs');
    // expect(response1.status).toBe(401);
  });
});
