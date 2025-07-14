import express from 'express';
import bodyParser from 'body-parser';
import { registerUser, authenticateUser, generateJWT, verifyJWT } from '@backend-suite/auth-core';
import { rateLimiterMiddleware } from '@backend-suite/rate-limiter';
import { createLogger } from '@backend-suite/logger';

const app = express();
const logger = createLogger('example-app');

app.use(bodyParser.json());
app.use(rateLimiterMiddleware({ tokensPerInterval: 5, interval: 'minute' }));

// Register endpoint
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  try {
    const user = registerUser(username, password);
    logger.info({ username }, 'User registered');
    res.status(201).json({ message: 'User registered', user: { id: user.id, username } });
  } catch (e: any) {
    logger.warn({ username }, 'Registration failed');
    res.status(400).json({ error: e.message });
  }
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const result = authenticateUser(username, password);
  if (result) {
    logger.info({ username }, 'User logged in');
    res.json({ accessToken: result.accessToken });
  } else {
    logger.warn({ username }, 'Login failed');
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// JWT auth middleware
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

// Protected route
app.get('/protected', requireAuth, (req, res) => {
  res.json({ message: 'Protected data', user: (req as any).user });
});

app.listen(3000, () => {
  logger.info('Express example app running on http://localhost:3000');
}); 