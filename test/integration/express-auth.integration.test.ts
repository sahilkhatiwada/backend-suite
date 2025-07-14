import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import bodyParser from 'body-parser';
import { registerUser, authenticateUser, generateJWT, verifyJWT } from '@backend-suite/auth-core';
import { rateLimiterMiddleware } from '@backend-suite/rate-limiter';
import { createLogger } from '@backend-suite/logger';
import supertest from 'supertest';

let server;
let request;

beforeAll(() => {
  const app = express();
  app.use(bodyParser.json());
  app.use(rateLimiterMiddleware({ tokensPerInterval: 5, interval: 'minute' }));

  app.post('/register', (req, res) => {
    const { username, password } = req.body;
    try {
      const user = registerUser(username, password);
      res.status(201).json({ message: 'User registered', user: { id: user.id, username } });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const result = authenticateUser(username, password);
    if (result) {
      res.json({ accessToken: result.accessToken });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  function requireAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
    try {
      const payload = verifyJWT(auth.slice(7), 'mysecret');
      (req as any).user = payload;
      next();
    } catch {
      res.status(401).json({ error: 'Invalid token' });
    }
  }

  app.get('/protected', requireAuth, (req, res) => {
    res.json({ message: 'Protected data', user: (req as any).user });
  });

  server = app.listen(0);
  request = supertest(server);
});

afterAll(() => {
  server.close();
});

describe('Express Auth Integration', () => {
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