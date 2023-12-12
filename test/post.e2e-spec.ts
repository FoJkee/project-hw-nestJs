import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';

describe('posts', () => {
  let app: INestApplication;
  let server;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
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

  it('delete all post', async () => {
    const response = await request(server).delete('/testing/all-data');
    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });
});
