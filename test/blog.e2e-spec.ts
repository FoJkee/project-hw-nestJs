import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { faker } from '@faker-js/faker';

describe('blogs', () => {
  let app: INestApplication;
  let server;
  const newBlog: any = null;

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
      const response = await request(server).delete('/testing/all-data');
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
    it('should delete all data, status 204', async () => {
      const response = await request(server).delete('/testing/all-data');
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    it('create blogs, 201', async () => {
      const blog = {
        name: faker.lorem.word({ length: 10 }),
        description: faker.lorem.word({ length: 50 }),
        websiteUrl: faker.internet.url(),
      };

      const response = await request(server)
        .post('/blogs')
        .auth('admin', 'qwerty', { type: 'basic' })
        .send(blog);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: expect.any(String),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: expect.any(String),
        isMembership: false,
      });
      expect(response.body).toBeDefined();
      expect.setState(response.body);
    });

    it('incorrect data blogs, 400', async () => {
      const errors = {
        errorsMessages: expect.arrayContaining([
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
        ]),
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

  describe('PUT => blogs', () => {
    it('update blog, 204', async () => {
      const { blog } = expect.getState();

      const updateBlog = {
        name: faker.lorem.word({ length: 10 }),
        description: faker.lorem.paragraph(2),
        websiteUrl: faker.internet.url(),
      };

      const response = await request(server)
        .put(`/blogs/${newBlog?.id}`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send(updateBlog);
      expect(response.status).toBe(204);

      const getResponse = await request(server)
        .get(`/blogs/${newBlog?.id}`)
        .auth('admin', 'qwerty', { type: 'basic' });

      expect(getResponse.status).toBe(200);

      expect(getResponse.body).toEqual({
        id: blog.id,
        name: updateBlog.name,
        description: updateBlog.description,
        websiteUrl: updateBlog.websiteUrl,
        createdAt: blog.description,
      });
    });

    it('user dont authorise, 401', async () => {
      const response = await request(server).put(`/blogs/1234`);
      expect(response.status).toBe(401);
    });

    it('incorrect data, 400', async () => {
      const errors = {
        errorsMessages: expect.arrayContaining([
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
        ]),
      };

      const response = await request(server)
        .put(`/blogs/${newBlog?.id}`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({});

      expect(response.status).toBe(400);
      expect(response.error).toStrictEqual(errors);

      const emptyUpdateBlog = {
        name: '',
        description: '',
        websiteUrl: '',
      };

      const response1 = await request(server)
        .put(`/blogs/${newBlog?.id}`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send(emptyUpdateBlog);

      expect(response1.status).toBe(400);
      expect(response1.error).toStrictEqual(errors);
    });

    it('bad request, 404', async () => {
      const updateBlog = {
        name: faker.lorem.word({ length: 10 }),
        description: faker.lorem.paragraph(2),
        websiteUrl: faker.internet.url(),
      };

      const response = await request(server)
        .put(`/blogs/-1`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send(updateBlog);

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE', () => {
    it('delete blog, 204', async () => {
      const responseGetBefore = await request(server)
        .get(`/blogs/${newBlog?.id}`)
        .auth('admin', 'qwerty', { type: 'basic' });
      expect(responseGetBefore.status).toBe(200);
      expect(responseGetBefore.body.items).toHaveLength(1);

      const responseDelete = await request(server)
        .delete(`/blogs/${newBlog?.id}`)
        .auth('admin', 'qwerty', { type: 'basic' });
      expect(responseDelete.status).toBe(204);

      const responseGetAfter = await request(server)
        .get(`/blogs/${newBlog?.id}`)
        .auth('admin', 'qwerty', { type: 'basic' });
      expect(responseGetAfter.status).toBe(200);
      expect(responseGetAfter.body.items).toHaveLength(0);
    });

    it('blog not exist, 404', async () => {
      const response = await request(server)
        .delete(`/blogs/-1`)
        .auth('admin', 'qwerty', { type: 'basic' });

      expect(response.status).toBe(404);
    });
    it('not auth, 401', async () => {
      const response = await request(server).delete(`/blogs/1233`);
      expect(response.status).toBe(401);
    });
  });

  describe('GET => blogId', () => {
    it('get blogId, 200', async () => {
      const response = await request(server).get(`/blogs/${newBlog?.id}`);

      expect(response.status).toBe(200);
    });
  });
});
