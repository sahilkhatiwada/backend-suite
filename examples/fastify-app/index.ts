import Fastify from 'fastify';
import { registerUser, authenticateUser, generateJWT, verifyJWT } from '@backend-suite/auth-core';
import { rateLimiterMiddleware } from '@backend-suite/rate-limiter';
import { createLogger } from '@backend-suite/logger';

const fastify = Fastify();
const logger = createLogger('fastify-app');

// Wrap rate limiter for Fastify
fastify.addHook('onRequest', (req, res, done) => {
  rateLimiterMiddleware({ tokensPerInterval: 5, interval: 'minute' })(req.raw, res.raw, done);
});

fastify.post('/register', async (request, reply) => {
  const { username, password } = request.body as any;
  try {
    const user = registerUser(username, password);
    logger.info({ username }, 'User registered');
    reply.status(201).send({ message: 'User registered', user: { id: user.id, username } });
  } catch (e: any) {
    logger.warn({ username }, 'Registration failed');
    reply.status(400).send({ error: e.message });
  }
});

fastify.post('/login', async (request, reply) => {
  const { username, password } = request.body as any;
  const result = authenticateUser(username, password);
  if (result) {
    logger.info({ username }, 'User logged in');
    reply.send({ accessToken: result.accessToken });
  } else {
    logger.warn({ username }, 'Login failed');
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

fastify.listen({ port: 5000 }, (err) => {
  if (err) {
    logger.error(err, 'Failed to start server');
    process.exit(1);
  }
  logger.info('Fastify example app running on http://localhost:5000');
}); 