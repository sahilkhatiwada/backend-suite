# @backend-suite/rate-limiter

IP, user, and route-based rate limiting with token bucket and Redis adapter. Express and Koa middleware support.

## Features
- Token bucket strategy (in-memory)
- Redis adapter for distributed rate limiting
- Express and Koa middleware
- Configurable limits per route

## Usage

### Programmatic
```ts
import { createTokenBucketLimiter, createRedisRateLimiter, expressRateLimiter, koaRateLimiter } from '@backend-suite/rate-limiter';

const limiter = createTokenBucketLimiter({ tokensPerInterval: 10, interval: 'minute' });

// Express
app.use(expressRateLimiter({ ... }));

// Koa
app.use(koaRateLimiter({ ... }));
```

## API
- `createTokenBucketLimiter(options)`
- `createRedisRateLimiter(options)`
- `expressRateLimiter(options)`
- `koaRateLimiter(options)` 