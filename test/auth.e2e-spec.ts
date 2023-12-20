import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { createApp } from '../src/config/create-app';
import request from 'supertest';
import { TestingUser } from './helper/helper';
import { UserViewModels } from '../src/user/models/user.view.models';
import { SecurityDevicesService } from '../src/security-devices/infractructure/security-devices.service';
import { faker } from '@faker-js/faker';
import { UserRepository } from '../src/user/infrastructure/user.repository';

describe('auth', () => {
  let app: INestApplication;
  let server;
  let accessToken;
  let user1: UserViewModels | null;
  let testingUser: TestingUser;
  let userRepository: UserRepository;
  let cookie: any;
  let session: any;
  let securityDevicesService: SecurityDevicesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app = createApp(app);
    await app.init();
    server = app.getHttpServer();
    testingUser = new TestingUser(server);
    securityDevicesService = app.get<SecurityDevicesService>(
      SecurityDevicesService,
    );
    userRepository = app.get<UserRepository>(UserRepository);
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
  describe('POST User', () => {
    it('create user', async () => {
      user1 = await testingUser.createUserForPagination();
      const response = await request(server)
        .get('/users')
        .auth('admin', 'qwerty', { type: 'basic' });

      expect(response.status).toBe(200);
    });
  });

  describe('POST Registration', () => {
    it('empty data registration user', async () => {
      const errRegistr = {
        errorsMessages: [
          {
            message: expect.any(String),
            field: 'login',
          },
          {
            message: expect.any(String),
            field: 'password',
          },
          {
            message: expect.any(String),
            field: 'email',
          },
        ],
      };
      const response = await request(server)
        .post('/auth/registration')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual(errRegistr);
    });

    it('create registration user', async () => {
      const response = await request(server).post('/auth/registration').send({
        login: 'andrey',
        password: '12345678',
        email: 'romanovsky0815@gmail.com',
      });
      expect(response.status).toBe(204);
    });
    it('data exist', async () => {
      await request(server)
        .post('/auth/registration')
        .send({
          login: 'andrey',
          password: '12345678',
          email: 'romanovsky0815@gmail.com',
        })
        .expect(400, {
          errorsMessages: [
            {
              message: 'Login exist',
              field: 'login',
            },
            {
              message: 'Email exist',
              field: 'email',
            },
          ],
        });
    });
  });

  describe('POST Login', () => {
    it('data incorrect, 400', async () => {
      const errorLogin = {
        errorsMessages: [
          {
            message: expect.any(String),
            field: 'loginOrEmail',
          },
          {
            message: expect.any(String),
            field: 'password',
          },
        ],
      };

      const response = await request(server).post('/auth/login').send({});
      expect(response.status).toBe(400);
      expect(response.body).toEqual(errorLogin);
    });
    it('login user', async () => {
      const response = await request(server)
        .post('/auth/login')
        .set('User-Agent', faker.internet.userAgent())
        .send({ loginOrEmail: 'kuraga', password: '1234567' });

      accessToken = response.body.accessToken;
      cookie = response.get('Set-Cookie');

      user1 = await userRepository._findUserId(user1!.id);
      session = await securityDevicesService.getDeviceAllSessionUserId(
        user1!.id,
      );
      expect(response.status).toBe(200);
      expect(accessToken).toBeDefined();
      expect(session.length).toBe(1);
      expect(response.body).toEqual({ accessToken: expect.any(String) });
      expect(cookie).toBeDefined();
    });
  });
  describe('POST Refresh-Token', () => {
    it('no cookies', async () => {
      const response = await request(server)
        .post('/auth/refresh-token')
        .send({});
      expect(response.status).toBe(401);
    });
    it('incorrect cookies', async () => {
      const response = await request(server)
        .post('/auth/refresh-token')
        .set('Cookie', ['refreshToken = Hello'])
        .send({});
      expect(response.status).toBe(401);
    });
    it('refresh-token user', async () => {
      const response = await request(server)
        .post('/auth/refresh-token')
        .set('Cookie', cookie)
        .send({});
      cookie = response.get('Set-Cookie');
      expect(response.body.accessToken).toBeDefined();
    });
  });
  describe('POST logout', () => {
    it('incorrect token user, 401', async () => {
      const response = await request(server)
        .post('/auth/logout')
        .set('Cookie', ['refreshToken = Hello'])
        .send({});

      expect(response.status).toBe(401);
    });
    it('incorrect token user, 401', async () => {
      const response = await request(server).post('/auth/logout').send({});

      expect(response.status).toBe(401);
    });
    it('logout user', async () => {
      const response = await request(server)
        .post('/auth/logout')
        .set('Cookie', cookie)
        .send({});

      user1 = await userRepository._findUserId(user1!.id);
      session = await securityDevicesService.getDeviceAllSessionUserId(
        user1!.id,
      );
      expect(response.status).toBe(204);
      expect(session.length).toBe(0);
    });
  });
  describe('GET => me', () => {
    it('unauthorized, 401', async () => {
      const response = await request(server).get(`/auth/me`);
      expect(response.status).toBe(401);
    });
    it('correct token, 200', async () => {
      const response = await request(server)
        .get(`/auth/me`)
        .auth(accessToken, { type: 'bearer' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        email: user1!.email,
        login: user1!.login,
        userId: user1!.id,
      });
    });
  });
});
