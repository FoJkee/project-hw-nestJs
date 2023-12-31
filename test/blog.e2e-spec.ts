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
  let newBlog2: BlogViewModels;
  let newBlog3: BlogViewModels;

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

    // it('return clear pagination', async () => {
    //   const paginationBlog = {
    //     pagesCount: 0,
    //     page: 1,
    //     pageSize: 10,
    //     totalCount: 0,
    //     items: [],
    //   };
    //   const response = await request(server).get('/blogs');
    //   expect(response.status).toBe(200);
    //   expect(response.body).toEqual(paginationBlog);
    // });
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
      newBlog1 = await testingBlog.createBlogForPagination();
      const response = await request(server).get('/blogs');
      expect(response.status).toBe(200);
    });
    it('create blogs, 201', async () => {
      newBlog2 = await testingBlog.createBlog();
      const response = await request(server).get('/blogs');
      expect(response.status).toBe(200);
    });
    // it('create blogs, 201', async () => {
    //   newBlog3 = await testingBlog.createBlogForPagination();
    //   const response = await request(server).get('/blogs');
    //   expect(response.status).toBe(200);
    // });
  });

  describe('GET => :id', () => {
    it(`don't exist blog, 404`, async () => {
      const response = await request(server).get(`/blogs/12345`);
      expect(response.status).toBe(404);
    });
    it('get blogId, 200', async () => {
      const response = await request(server).get(`/blogs/${newBlog1.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(newBlog1);
    });
  });

  describe('GET blogs', () => {
    // it('pagination: sortBy: createdAt, sortDirection: desc, pageNumber: 1, pageSize: 10', async () => {
    //   const response = await request(server).get('/blogs').query({
    //     sortBy: 'createdAt',
    //     sortDirection: 'desc',
    //     pageNumber: 1,
    //     pageSize: 10,
    //   });
    //   expect(response.status).toBe(200);
    //   // expect(response.body.items[0].id > response.body.items[1].id).toBe(true);
    //   expect(response.body).toEqual({
    //     pagesCount: 1,
    //     page: 1,
    //     pageSize: 10,
    //     totalCount: 2,
    //     items: expect.any(Array),
    //   });
    // });

    it('pagination: sortBy: createdAt, sortDirection: asc, pageNumber: 1, pageSize: 10', async () => {
      // const blogs = []
      // const sortingBlogs = blogs.sort(name asc)
      // const blogsFromResponse = app.req(sortBy=name&sortDirection=asc)
      // expect(blogsFromResponse.body).toEqual(sortingBlogs)

      const blogs = [newBlog1, newBlog2];

      const sortingBlogs = blogs.sort((a, b) => {
        if (a.createdAt < b.createdAt) return -1;
        if (a.createdAt > b.createdAt) return 1;
        return 0;
      }); //as asc

      const response = await request(server).get('/blogs').query({
        sortBy: 'createdAt',
        sortDirection: 'asc',
      });
      expect(response.status).toBe(200);
      expect(response.body.items).toEqual(sortingBlogs);

      expect(response.body).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 2,
        items: expect.any(Array),
      });
    });

    // it('pagination pageNumber=2, pageSize=1, sortBy=createdAt(default), sortDirection=desc(default)', async () => {
    //   const response = await request(server).get('/blogs').query({
    //     sortBy: 'createdAt',
    //     sortDirection: 'desc',
    //     pageNumber: 2,
    //     pageSize: 1,
    //   });
    //   expect(response.status).toBe(200);
    //   expect(response.body).toEqual({
    //     pagesCount: 2,
    //     page: 2,
    //     pageSize: 1,
    //     totalCount: 2,
    //     items: expect.any(Array),
    //   });
    // });

    it('pagination searchNameTerm', async () => {
      const response = await request(server).get('/blogs').query({
        searchNameTerm: 'Ka',
      });
      expect(response.status).toBe(200);
      expect(response.body.items[0].id).toBe(newBlog1.id);
    });
  });

  // describe('PUT => blogs', () => {
  //   it('user dont authorise, 401', async () => {
  //     const response = await request(server).put(`/blogs/1234`);
  //     expect(response.status).toBe(401);
  //   });
  //   it('no data available update blogs, 400', async () => {
  //     const errors = {
  //       errorsMessages: [
  //         {
  //           message: expect.any(String),
  //           field: 'name',
  //         },
  //         {
  //           message: expect.any(String),
  //           field: 'description',
  //         },
  //         {
  //           message: expect.any(String),
  //           field: 'websiteUrl',
  //         },
  //       ],
  //     };
  //
  //     const response = await request(server)
  //       .put(`/blogs/${newBlog1.id}`)
  //       .auth('admin', 'qwerty', { type: 'basic' })
  //       .send({});
  //
  //     expect(response.status).toBe(400);
  //     expect(response.body).toStrictEqual(errors);
  //   });
  //   it('data is empty blogs, 400', async () => {
  //     const errors = {
  //       errorsMessages: [
  //         {
  //           message: expect.any(String),
  //           field: 'name',
  //         },
  //         {
  //           message: expect.any(String),
  //           field: 'description',
  //         },
  //         {
  //           message: expect.any(String),
  //           field: 'websiteUrl',
  //         },
  //       ],
  //     };
  //
  //     const emptyUpdateBlog = {
  //       name: '',
  //       description: '',
  //       websiteUrl: '',
  //     };
  //
  //     const response = await request(server)
  //       .put(`/blogs/${newBlog1.id}`)
  //       .auth('admin', 'qwerty', { type: 'basic' })
  //       .send(emptyUpdateBlog);
  //
  //     expect(response.status).toBe(400);
  //     expect(response.body).toStrictEqual(errors);
  //   });
  //   it('bad request, 404', async () => {
  //     const updateBlog = {
  //       name: faker.lorem.word({ length: 10 }),
  //       description: faker.lorem.paragraph(2),
  //       websiteUrl: faker.internet.url(),
  //     };
  //
  //     const response = await request(server)
  //       .put(`/blogs/-1`)
  //       .auth('admin', 'qwerty', { type: 'basic' })
  //       .send(updateBlog);
  //
  //     expect(response.status).toBe(404);
  //   });
  //
  //   it('update blog, 204', async () => {
  //     const updateBlog = {
  //       name: faker.lorem.word({ length: 15 }),
  //       description: faker.lorem.paragraph(2),
  //       websiteUrl: faker.internet.url(),
  //     };
  //
  //     const response = await request(server)
  //       .put(`/blogs/${newBlog1.id}`)
  //       .auth('admin', 'qwerty', { type: 'basic' })
  //       .send(updateBlog);
  //
  //     expect(response.status).toBe(204);
  //
  //     const getResponse = await request(server)
  //       .get(`/blogs/${newBlog1.id}`)
  //       .auth('admin', 'qwerty', { type: 'basic' });
  //     expect(getResponse.status).toBe(200);
  //
  //     expect(getResponse.body).toEqual({
  //       ...newBlog1,
  //       name: updateBlog.name,
  //       description: updateBlog.description,
  //       websiteUrl: updateBlog.websiteUrl,
  //     });
  //   });
  // });

  // describe('DELETE', () => {
  //   it('blog not exist, 404', async () => {
  //     const response = await request(server)
  //       .delete(`/blogs/-1`)
  //       .auth('admin', 'qwerty', { type: 'basic' });
  //
  //     expect(response.status).toBe(404);
  //   });
  //   it('not auth, 401', async () => {
  //     const response = await request(server).delete(`/blogs/1233`);
  //     expect(response.status).toBe(401);
  //   });
  //   it('delete blog, 204', async () => {
  //     const responseDelete = await request(server)
  //       .delete(`/blogs/${newBlog1.id}`)
  //       .auth('admin', 'qwerty', { type: 'basic' });
  //     expect(responseDelete.status).toBe(204);
  //
  //     const responseGetAfter = await request(server)
  //       .get(`/blogs/${newBlog1.id}`)
  //       .auth('admin', 'qwerty', { type: 'basic' });
  //     expect(responseGetAfter.status).toBe(404);
  //   });
  // });

  describe('POST :blogId/posts', () => {
    it('create post not existing blogId, 404', async () => {
      const post = {
        title: faker.lorem.word({ length: 10 }),
        shortDescription: faker.lorem.word({ length: 10 }),
        content: faker.lorem.word({ length: 10 }),
      };

      const response = await request(server)
        .post('/blogs/-1234/posts')
        .auth('admin', 'qwerty', { type: 'basic' })
        .send(post);
      expect(response.status).toBe(404);
    });

    it('Unauthorized, 401', async () => {
      const response = await request(server).post(
        `/blogs/${newBlog1.id}/posts`,
      );
      expect(response.status).toBe(401);
    });

    it('incorrect data, 400', async () => {
      const response = await request(server)
        .post(`/blogs/${newBlog1.id}/posts`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({
          title: 'string',
        });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        errorsMessages: expect.arrayContaining([
          {
            message: expect.any(String),
            field: 'shortDescription',
          },
          {
            message: expect.any(String),
            field: 'content',
          },
        ]),
      });
    });

    it('create post existing blogId, 201', async () => {
      const post = {
        title: faker.lorem.word({ length: 10 }),
        shortDescription: faker.lorem.word({ length: 10 }),
        content: faker.lorem.word({ length: 10 }),
      };
      const response = await request(server)
        .post(`/blogs/${newBlog2.id}/posts`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send(post);

      expect(response.status).toBe(201);

      // const resultPost = await request(server).get(
      //   `/posts/${response.body.id}`,
      // );
      // expect(response.body).toEqual(resultPost.body);
    });
  });

  describe('GET :blogId/posts', () => {
    it('If specificied blog is not exists', async () => {
      const response = await request(server).get('/blogs/1234/posts');
      expect(response.status).toBe(404);
    });

    it('pagination: sortBy: createdAt, sortDirection: desc, pageNumber: 1, pageSize: 10', async () => {
      const response = await request(server)
        .get(`/blogs/${newBlog2.id}/posts`)
        .query({
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
        totalCount: 1,
        items: expect.any(Array),
      });
    });
    it('pagination: sortBy: createdAt, sortDirection: asc, pageNumber: 1, pageSize: 10', async () => {
      const response = await request(server)
        .get(`/blogs/${newBlog2.id}/posts`)
        .query({
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
        totalCount: 1,
        items: expect.any(Array),
      });
    });
  });
});
