import { describe, it, expect } from 'vitest';
import { createTokenBucketLimiter, createRedisRateLimiter, expressRateLimiter, koaRateLimiter } from '../src';

describe('rate-limiter', () => {
  it('should export all main functions', () => {
    expect(typeof createTokenBucketLimiter).toBe('function');
    expect(typeof createRedisRateLimiter).toBe('function');
    expect(typeof expressRateLimiter).toBe('function');
    expect(typeof koaRateLimiter).toBe('function');
  });
}); 