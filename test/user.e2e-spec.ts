import { INestApplication } from '@nestjs/common';

import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { createApp } from '../src/config/create-app';
import request from 'supertest';
import { TestingUser } from './helper/helper';
import { UserViewModels } from '../src/user/models/user.view.models';

describe('user', () => {
  let app: INestApplication;
  let server;
  let testingUser: TestingUser;
  let newUser1: UserViewModels;
  let newUser2: UserViewModels;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app = createApp(app);
    await app.init();
    server = app.getHttpServer();
    testingUser = new TestingUser(server);
  });

  afterAll(async () => {
    await app.close();
    await server.close();
  });

  describe('DELETE ALL', () => {
    it('delete all user', async () => {
      const response = await request(server).delete('/testing/all-data');
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
  });

  describe('POST', () => {
    it('Unauthorized user, 401', async () => {
      const response = await request(server).post('/users').send({});
      expect(response.status).toBe(401);
    });
    // it('no data available user, 400', async () => {
    //   const errorUser = {
    //     errorsMessages: [
    //       {
    //         message: expect.any(String),
    //         field: 'login',
    //       },
    //       {
    //         message: expect.any(String),
    //         field: 'email',
    //       },
    //       {
    //         message: expect.any(String),
    //         field: 'password',
    //       },
    //     ],
    //   };
    //   await request(server)
    //     .post('/users')
    //     .auth('admin', 'qwerty', { type: 'basic' })
    //     .send({})
    //     .expect(400, errorUser);
    //
    //   const response = await request(server)
    //     .get(`/users`)
    //     .auth('admin', 'qwerty', { type: 'basic' });
    //   expect(response.body.items).toHaveLength(0);
    // });

    it('correct data user, 201', async () => {
      newUser1 = await testingUser.createUser();
      const response = await request(server)
        .get('/users')
        .auth('admin', 'qwerty', { type: 'basic' });

      expect(response.status).toBe(200);
    });
    it('correct data user, 201', async () => {
      newUser2 = await testingUser.createUser();
      const response = await request(server)
        .get('/users')
        .auth('admin', 'qwerty', { type: 'basic' });

      expect(response.status).toBe(200);
    });
  });
  describe('GET', () => {
    it('Unauthorized user, 401', async () => {
      const response = await request(server).get('/users');
      expect(response.status).toBe(401);
    });
    it('pagination: sortBy: createdAt, sortDirection: desc, pageNumber: 1, pageSize: 10', async () => {
      const response = await request(server)
        .get('/users')
        .auth('admin', 'qwerty', { type: 'basic' })
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
        totalCount: 2,
        items: expect.any(Array),
      });
    });
    it('pagination: sortBy: createdAt, sortDirection: asc, pageNumber: 1, pageSize: 10', async () => {
      const response = await request(server)
        .get('/users')
        .auth('admin', 'qwerty', { type: 'basic' })
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
        totalCount: 2,
        items: expect.any(Array),
      });
    });
  });
});
