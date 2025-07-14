# @backend-suite/rate-limiter

> Part of the [backend-suite](https://github.com/your-org/backend-suite) monorepo — a unified ecosystem of modular, production-ready backend utilities.

## Packages in the Suite
- [@backend-suite/env-crypto](../env-crypto)
- [@backend-suite/rate-limiter](../rate-limiter)
- [@backend-suite/logger](../logger)

## How to Use Multiple Packages
Install any package you need:
```sh
pnpm add @backend-suite/env-crypto @backend-suite/rate-limiter @backend-suite/logger
```

Import and use in your project:
```ts
import { encryptEnvFile } from '@backend-suite/env-crypto';
import { createTokenBucketLimiter } from '@backend-suite/rate-limiter';
import { createLogger } from '@backend-suite/logger';
```

## Versioning
This package is versioned independently using [Changesets](https://github.com/changesets/changesets). See the monorepo root for release and changelog management.

---

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