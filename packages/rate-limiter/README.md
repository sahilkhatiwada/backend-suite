# @backend-suite/rate-limiter

IP, user, and route-based rate limiting with token bucket and Redis adapter. Express and Koa middleware support.

## Features
- Token bucket strategy (in-memory)
- Redis adapter for distributed rate limiting
- Express and Koa middleware
- Configurable limits per route

## Installation
```sh
pnpm add @backend-suite/rate-limiter
```

## Usage

### In-memory Token Bucket
```ts
import { createTokenBucketLimiter } from '@backend-suite/rate-limiter';
const limiter = createTokenBucketLimiter({ tokensPerInterval: 10, interval: 'minute' });
if (limiter.allow('user:123')) {
  // allowed
}
```

### Redis Adapter
```ts
import { createRedisRateLimiter } from '@backend-suite/rate-limiter';
import Redis from 'ioredis';
const redis = new Redis();
const limiter = createRedisRateLimiter({ redis, tokensPerInterval: 10, interval: 'minute' });
if (await limiter.allow('user:123')) {
  // allowed
}
```

### Express Middleware
```ts
import express from 'express';
import { createTokenBucketLimiter, expressRateLimiter } from '@backend-suite/rate-limiter';
const app = express();
const limiter = createTokenBucketLimiter({ tokensPerInterval: 10, interval: 'minute' });
app.use(expressRateLimiter({ limiter }));
```

### Koa Middleware
```ts
import Koa from 'koa';
import { createTokenBucketLimiter, koaRateLimiter } from '@backend-suite/rate-limiter';
const app = new Koa();
const limiter = createTokenBucketLimiter({ tokensPerInterval: 10, interval: 'minute' });
app.use(koaRateLimiter({ limiter }));
```

## API
- `createTokenBucketLimiter(options)`
- `createRedisRateLimiter(options)`
- `expressRateLimiter(options)`
- `koaRateLimiter(options)`

## License
MIT 