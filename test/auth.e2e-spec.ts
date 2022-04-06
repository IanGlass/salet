import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('auth/signup/ (POST)', async () => {
    const signupEmail = 'test@test.com';
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: signupEmail,
        password: 'testpass',
      })
      .expect(201);

    const { id, email } = response.body;
    expect(id).toBeDefined();
    expect(email).toEqual(signupEmail);
  });
  it('signup as new user then get currently logged in user', async () => {
    const signupEmail = 'test@test.com';
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: signupEmail,
        password: 'testpass',
      })
      .expect(201);

    const cookie = response.get('Set-Cookie');
    expect(cookie).toBeDefined();

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(signupEmail);
  });
});
