// TODO:
// - Implement in-memory token bucket algorithm
// - Implement Redis adapter for distributed rate limiting
// - Add Express middleware
// - Add Koa middleware
// - Add configuration for per-route limits
// - Add tests for all strategies
// - Add usage examples

import type { Request, Response, NextFunction } from 'express';
import type { Context, Next as KoaNext } from 'koa';
import Redis from 'ioredis';

// In-memory token bucket implementation
export function createTokenBucketLimiter({ tokensPerInterval, interval }: { tokensPerInterval: number; interval: 'second' | 'minute' | 'hour'; }) {
  const buckets = new Map<string, { tokens: number; lastRefill: number }>();
  const intervalMs = interval === 'second' ? 1000 : interval === 'minute' ? 60000 : 3600000;

  function allow(key: string): boolean {
    const now = Date.now();
    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = { tokens: tokensPerInterval, lastRefill: now };
      buckets.set(key, bucket);
    }
    // refill tokens
    const elapsed = now - bucket.lastRefill;
    const refill = Math.floor(elapsed / intervalMs) * tokensPerInterval;
    if (refill > 0) {
      bucket.tokens = Math.min(tokensPerInterval, bucket.tokens + refill);
      bucket.lastRefill = now;
    }
    if (bucket.tokens > 0) {
      bucket.tokens--;
      return true;
    }
    return false;
  }

  return { allow };
}

// Redis adapter for distributed rate limiting
export function createRedisRateLimiter({ redis, tokensPerInterval, interval }: { redis: Redis; tokensPerInterval: number; interval: 'second' | 'minute' | 'hour'; }) {
  const intervalSec = interval === 'second' ? 1 : interval === 'minute' ? 60 : 3600;
  return {
    async allow(key: string): Promise<boolean> {
      const lua = `
        local tokens = tonumber(redis.call('get', KEYS[1]) or ARGV[1])
        if tokens > 0 then
          redis.call('decr', KEYS[1])
          redis.call('expire', KEYS[1], ARGV[2])
          return 1
        else
          redis.call('set', KEYS[1], ARGV[1], 'EX', ARGV[2])
          return 0
        end
      `;
      const allowed = await redis.eval(lua, 1, key, tokensPerInterval, intervalSec);
      return allowed === 1;
    },
  };
}

// Express middleware
export function expressRateLimiter({ limiter, keyFn }: { limiter: { allow: (key: string) => boolean | Promise<boolean> }; keyFn?: (req: Request) => string }) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const key = keyFn ? keyFn(req) : req.ip;
    const allowed = await limiter.allow(key);
    if (!allowed) {
      res.status(429).send('Too Many Requests');
    } else {
      next();
    }
  };
}

// Koa middleware
export function koaRateLimiter({ limiter, keyFn }: { limiter: { allow: (key: string) => boolean | Promise<boolean> }; keyFn?: (ctx: Context) => string }) {
  return async function (ctx: Context, next: KoaNext) {
    const key = keyFn ? keyFn(ctx) : ctx.ip;
    const allowed = await limiter.allow(key);
    if (!allowed) {
      ctx.status = 429;
      ctx.body = 'Too Many Requests';
    } else {
      await next();
    }
  };
} 