import { describe, it, expect, vi } from 'vitest';
import { createTokenBucketLimiter, expressRateLimiter } from '../src';
import type { Request, Response, NextFunction } from 'express';

describe('rate-limiter', () => {
  it('should allow up to tokensPerInterval per interval (token bucket)', () => {
    const limiter = createTokenBucketLimiter({ tokensPerInterval: 2, interval: 'second' });
    expect(limiter.allow('ip')).toBe(true);
    expect(limiter.allow('ip')).toBe(true);
    expect(limiter.allow('ip')).toBe(false);
  });

  it('should use custom key function in express middleware', async () => {
    const limiter = { allow: vi.fn().mockReturnValue(true) };
    const req = { ip: '1.2.3.4', user: { id: 'u1' } } as unknown as Request;
    const res = { status: vi.fn().mockReturnThis(), send: vi.fn() } as unknown as Response;
    const next = vi.fn() as NextFunction;
    const mw = expressRateLimiter({ limiter, keyFn: (req) => req.user.id });
    await mw(req, res, next);
    expect(limiter.allow).toHaveBeenCalledWith('u1');
    expect(next).toHaveBeenCalled();
  });

  it('should block when not allowed in express middleware', async () => {
    const limiter = { allow: vi.fn().mockReturnValue(false) };
    const req = { ip: '1.2.3.4' } as unknown as Request;
    const res = { status: vi.fn().mockReturnThis(), send: vi.fn() } as unknown as Response;
    const next = vi.fn() as NextFunction;
    const mw = expressRateLimiter({ limiter });
    await mw(req, res, next);
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.send).toHaveBeenCalledWith('Too Many Requests');
    expect(next).not.toHaveBeenCalled();
  });
}); 