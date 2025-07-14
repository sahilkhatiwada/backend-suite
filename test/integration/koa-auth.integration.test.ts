import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { registerUser, authenticateUser, generateJWT, verifyJWT } from '@backend-suite/auth-core';
import { rateLimiterMiddleware } from '@backend-suite/rate-limiter';
import { createLogger } from '@backend-suite/logger';
import supertest from 'supertest';

let server;
let request;

beforeAll(() => {
  const app = new Koa();
  const router = new Router();
  app.use(bodyParser());
  app.use(async (ctx, next) => {
    await new Promise((resolve, reject) => {
      rateLimiterMiddleware({ tokensPerInterval: 5, interval: 'minute' })(ctx.req, ctx.res, (err) => {
        if (err) reject(err);
        else resolve(undefined);
      });
    });
    await next();
  });

  router.post('/register', (ctx) => {
    const { username, password } = ctx.request.body;
    try {
      const user = registerUser(username, password);
      ctx.status = 201;
      ctx.body = { message: 'User registered', user: { id: user.id, username } };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { error: e.message };
    }
  });

  router.post('/login', (ctx) => {
    const { username, password } = ctx.request.body;
    const result = authenticateUser(username, password);
    if (result) {
      ctx.body = { accessToken: result.accessToken };
    } else {
      ctx.status = 401;
      ctx.body = { error: 'Invalid credentials' };
    }
  });

  function requireAuth(ctx, next) {
    const auth = ctx.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      ctx.status = 401;
      ctx.body = { error: 'Missing token' };
      return;
    }
    try {
      const payload = verifyJWT(auth.slice(7), 'mysecret');
      ctx.state.user = payload;
      return next();
    } catch {
      ctx.status = 401;
      ctx.body = { error: 'Invalid token' };
    }
  }

  router.get('/protected', requireAuth, (ctx) => {
    ctx.body = { message: 'Protected data', user: ctx.state.user };
  });

  app.use(router.routes()).use(router.allowedMethods());
  server = app.listen(0);
  request = supertest(server);
});

afterAll(() => {
  server.close();
});

describe('Koa Auth Integration', () => {
  it('registers, logs in, and accesses protected route', async () => {
    // Register
    const regRes = await request.post('/register').send({ username: 'testuser', password: 'pw' });
    expect(regRes.status).toBe(201);
    // Login
    const loginRes = await request.post('/login').send({ username: 'testuser', password: 'pw' });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.accessToken).toBeDefined();
    // Access protected
    const protectedRes = await request.get('/protected').set('Authorization', `Bearer ${loginRes.body.accessToken}`);
    expect(protectedRes.status).toBe(200);
    expect(protectedRes.body.user.sub).toBe('testuser');
  });
}); 