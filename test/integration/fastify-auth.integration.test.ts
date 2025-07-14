import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify from 'fastify';
import { registerUser, authenticateUser, generateJWT, verifyJWT } from '@backend-suite/auth-core';
import { rateLimiterMiddleware } from '@backend-suite/rate-limiter';
import { createLogger } from '@backend-suite/logger';
import supertest from 'supertest';

let server;
let request;

beforeAll(async () => {
  const fastify = Fastify();
  fastify.addHook('onRequest', (req, res, done) => {
    rateLimiterMiddleware({ tokensPerInterval: 5, interval: 'minute' })(req.raw, res.raw, done);
  });

  fastify.post('/register', async (request, reply) => {
    const { username, password } = request.body as any;
    try {
      const user = registerUser(username, password);
      reply.status(201).send({ message: 'User registered', user: { id: user.id, username } });
    } catch (e: any) {
      reply.status(400).send({ error: e.message });
    }
  });

  fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body as any;
    const result = authenticateUser(username, password);
    if (result) {
      reply.send({ accessToken: result.accessToken });
    } else {
      reply.status(401).send({ error: 'Invalid credentials' });
    }
  });

  fastify.addHook('preHandler', (request, reply, done) => {
    if (request.routerPath === '/protected') {
      const auth = request.headers.authorization;
      if (!auth || !auth.startsWith('Bearer ')) {
        reply.status(401).send({ error: 'Missing token' });
        return;
      }
      try {
        const payload = verifyJWT(auth.slice(7), 'mysecret');
        (request as any).user = payload;
        done();
      } catch {
        reply.status(401).send({ error: 'Invalid token' });
      }
    } else {
      done();
    }
  });

  fastify.get('/protected', async (request, reply) => {
    reply.send({ message: 'Protected data', user: (request as any).user });
  });

  await fastify.listen({ port: 0 });
  const address = fastify.server.address();
  const port = typeof address === 'object' && address ? address.port : 0;
  server = fastify.server;
  request = supertest(`http://127.0.0.1:${port}`);
});

afterAll((done) => {
  server.close(done);
});

describe('Fastify Auth Integration', () => {
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