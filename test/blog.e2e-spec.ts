import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { TestingBlog } from './helper/helper';
import { createApp } from '../src/config/create-app';
import { faker } from '@faker-js/faker';
import { BlogViewModels } from '../src/blog/models/blog.view.models';

describe('blogs', () => {
  let app: INestApplication;
  let server;
  let testingBlog: TestingBlog;
  let newBlog1: BlogViewModels;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app = createApp(app);
    await app.init();
    server = app.getHttpServer();
    testingBlog = new TestingBlog(server);
    // testingPost = new TestingPost(server);
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
      const response = await request(server).get('/blogs');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(paginationBlog);
    });
  });

  describe('POST blogs', () => {
    it('no data available blogs, 400', async () => {
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
    });
    it('data is empty blogs, 400', async () => {
      const newBlog = {
        name: '',
        description: '',
        websiteUrl: '',
      };
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
        .send(newBlog);
      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual(errors);
    });
    it('Unauthorized, 401', async () => {
      const response = await request(server).post('/blogs');
      expect(response.status).toBe(401);
    });
    it('create blogs, 201', async () => {
      newBlog1 = await testingBlog.createBlog();
      const response = await request(server).get('/blogs');
      expect(response.status).toBe(200);
    });
  });

  describe('GET => :id', () => {
    it('get blogId, 200', async () => {
      const response = await request(server).get(`/blogs/${newBlog1.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(newBlog1);
    });

    it(`don't exist blog, 404`, async () => {
      const response = await request(server).get(`/blogs/12345`);
      expect(response.status).toBe(404);
    });
  });

  describe('GET blogs', () => {
    it('pagination: sortBy: createdAt, sortDirection: desc, pageNumber: 1, pageSize: 10', async () => {
      const response = await request(server)
        .get('/blogs')
        .query({
          sortBy: 'createdAt',
          sortDirection: 'desc',
          pageNumber: 1,
          pageSize: 10,
        })
        .expect(200);

      // expect(response.body).toEqual({
      //   pagesCount: Math.ceil(countDocument / pageSize),
      //   page: pageNumber,
      //   pageSize: pageSize,
      //   totalCount: countDocument,
      //   items: expect.any(Array),
      // });
      // expect(response.body.pagesCount).toBe(1);
      // expect(response.body.page).toBe(1);
      // expect(response.body.pageSize).toBe(10);
      // expect(response.body.totalCount).toBe(1);
      // expect(response.body.items).toHaveLength(1);
    });

    it('pagination: sortBy: createdAt, sortDirection: desc, pageNumber: 2, pageSize: 1', async () => {
      const response = await request(server).get(
        '/blogs?pageNumber=2&pageSize=1',
      );
      expect(response.status).toBe(200);
      expect(response.body.pagesCount).toBe(2);
      expect(response.body.page).toBe(2);
      expect(response.body.pageSize).toBe(1);
      expect(response.body.totalCount).toBe(2);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].id > response.body.items[1].id).toBe(true);
    });

    it('pagination: sortBy: id, sortDirection: asc, pageNumber: 1, pageSize: 10', async () => {
      const response = await request(server)
        .get('/blogs')
        .query({
          pageNumber: 1,
          pageSize: 10,
          sortBy: 'id',
          sortDirection: 'asc',
        })
        .expect(200);

      expect(response.body).toEqual({
        page: 1,
        pageSize: 10,
        sortBy: 'id',
        sortDirection: 'asc',
        items: expect.any(Array),
      });

      expect(response.body.items[0].id < response.body.items[1].id).toBe(true);
    });
  });

  describe('PUT => blogs', () => {
    it('user dont authorise, 401', async () => {
      const response = await request(server).put(`/blogs/1234`);
      expect(response.status).toBe(401);
    });
    it('no data available update blogs, 400', async () => {
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
        .put(`/blogs/${newBlog1.id}`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual(errors);
    });
    it('data is empty blogs, 400', async () => {
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

      const emptyUpdateBlog = {
        name: '',
        description: '',
        websiteUrl: '',
      };

      const response = await request(server)
        .put(`/blogs/${newBlog1.id}`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send(emptyUpdateBlog);

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual(errors);
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
    it('update blog, 204', async () => {
      const updateBlog = {
        name: faker.lorem.word({ length: 15 }),
        description: faker.lorem.paragraph(2),
        websiteUrl: faker.internet.url(),
      };

      const response = await request(server)
        .put(`/blogs/${newBlog1.id}`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send(updateBlog);

      expect(response.status).toBe(204);

      const getResponse = await request(server)
        .get(`/blogs/${newBlog1.id}`)
        .auth('admin', 'qwerty', { type: 'basic' });
      expect(getResponse.status).toBe(200);

      expect(getResponse.body).toEqual({
        ...newBlog1,
        name: updateBlog.name,
        description: updateBlog.description,
        websiteUrl: updateBlog.websiteUrl,
      });
    });
  });

  describe('DELETE', () => {
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
    it('delete blog, 204', async () => {
      const responseGetBefore = await request(server)
        .get(`/blogs/${newBlog1.id}`)
        .auth('admin', 'qwerty', { type: 'basic' });
      expect(responseGetBefore.status).toBe(200);

      const responseDelete = await request(server)
        .delete(`/blogs/${newBlog1.id}`)
        .auth('admin', 'qwerty', { type: 'basic' });
      expect(responseDelete.status).toBe(204);

      const responseGetAfter = await request(server)
        .get(`/blogs/${newBlog1.id}`)
        .auth('admin', 'qwerty', { type: 'basic' });
      expect(responseGetAfter.status).toBe(404);
    });
  });

  // describe('POST :blogId/posts', () => {
  //   it('create post not existing blogId, 404', async () => {
  //     const post = {
  //       title: faker.lorem.word({ length: 10 }),
  //       shortDescription: faker.lorem.word({ length: 10 }),
  //       content: faker.lorem.word({ length: 10 }),
  //     };
  //
  //     const response = await request(server)
  //       .post('/blogs/1234/posts')
  //       .auth('admin', 'qwerty', { type: 'basic' })
  //       .send(post);
  //     expect(response.status).toBe(404);
  //   });
  //
  //   it('Unauthorized, 401', async () => {
  //     const response = await request(server).post(
  //       `/blogs/${newBlog1.id}/posts`,
  //     );
  //     expect(response.status).toBe(401);
  //   });
  //
  //   it('incorrect data, 400', async () => {
  //     const response = await request(server)
  //       .post(`/blogs/${newBlog1.id}/posts`)
  //       .auth('admin', 'qwerty', { type: 'basic' })
  //       .send({
  //         title: 'string',
  //       });
  //     expect(response.status).toBe(400);
  //     expect(response.body).toEqual({
  //       errorsMessages: expect.arrayContaining([
  //         {
  //           message: expect.any(String),
  //           field: 'shortDescription',
  //         },
  //         {
  //           message: expect.any(String),
  //           field: 'content',
  //         },
  //       ]),
  //     });
  //   });
  //
  //   it('create post existing blogId, 201', async () => {
  //     const post = {
  //       title: faker.lorem.word({ length: 10 }),
  //       shortDescription: faker.lorem.word({ length: 10 }),
  //       content: faker.lorem.word({ length: 10 }),
  //     };
  //
  //     const response = await request(server)
  //       .post(`/blogs/${newBlog1.id}/posts`)
  //       .auth('admin', 'qwerty', { type: 'basic' })
  //       .send(post);
  //
  //     expect(response.status).toBe(201);
  //     newPost = response.body;
  //     const resultPost = await request(server).get(`/posts/${newPost?.id}`);
  //     expect(response.body).toEqual(resultPost.body);
  //   });
  // });

  // describe('GET :blogId/posts', () => {
  //   it('If specificied blog is not exists', async () => {
  //     const response = await request(server).get('/blogs/1234/posts');
  //     expect(response.status).toBe(404);
  //   });
  //
  //   it('pagination: sortBy: createdAt, sortDirection: desc, pageNumber: 1, pageSize: 10', async () => {
  //     const response = await request(server).get(`/blogs/${newBlog1.id}/posts`);
  //     expect(response.status).toBe(200);
  //     expect(response.body.pagesCount).toBe(1);
  //     expect(response.body.page).toBe(1);
  //     expect(response.body.pageSize).toBe(10);
  //     expect(response.body.totalCount).toBe(2);
  //     expect(response.body.items).toHaveLength(2);
  //   });
  //
  //   it('pagination - pagination - pageNumber=2, pageSize=3, sortDirection=asc', async () => {
  //     const response = await request(server).get(
  //       `/blogs/${newBlog1.id}/posts?pageNumber=2&pageSize=3&sortDirection=asc`,
  //     );
  //     expect(response.status).toBe(200);
  //     expect(response.body.pagesCount).toBe(1);
  //     expect(response.body.page).toBe(2);
  //     expect(response.body.pageSize).toBe(3);
  //     expect(response.body.totalCount).toBe(3);
  //     expect(response.body.items).toHaveLength(3);
  //   });
  // });
});
