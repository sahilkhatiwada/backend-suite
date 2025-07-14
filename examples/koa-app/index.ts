import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { registerUser, authenticateUser, generateJWT, verifyJWT } from '@backend-suite/auth-core';
import { rateLimiterMiddleware } from '@backend-suite/rate-limiter';
import { createLogger } from '@backend-suite/logger';

const app = new Koa();
const router = new Router();
const logger = createLogger('koa-app');

app.use(bodyParser());
app.use(async (ctx, next) => {
  // Wrap rate limiter for Koa
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
    logger.info({ username }, 'User registered');
    ctx.status = 201;
    ctx.body = { message: 'User registered', user: { id: user.id, username } };
  } catch (e: any) {
    logger.warn({ username }, 'Registration failed');
    ctx.status = 400;
    ctx.body = { error: e.message };
  }
});

router.post('/login', (ctx) => {
  const { username, password } = ctx.request.body;
  const result = authenticateUser(username, password);
  if (result) {
    logger.info({ username }, 'User logged in');
    ctx.body = { accessToken: result.accessToken };
  } else {
    logger.warn({ username }, 'Login failed');
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

app.listen(4000, () => {
  logger.info('Koa example app running on http://localhost:4000');
}); 