import { describe, it, expect, vi } from 'vitest';
import { AbuseDetector, abuseMiddleware, AbuseRule, AbuseContext } from '../src';

describe('AbuseDetector', () => {
  it('should trigger rule and call action', async () => {
    const action = vi.fn();
    const rule: AbuseRule = {
      id: 'test-rule',
      check: (ctx) => ctx.ip === '1.2.3.4',
      action,
    };
    const detector = new AbuseDetector({ rules: [rule] });
    const context: AbuseContext = { ip: '1.2.3.4' };
    const abused = await detector.check(context);
    expect(abused).toBe(true);
    expect(action).toHaveBeenCalled();
  });

  it('should not trigger rule if check fails', async () => {
    const action = vi.fn();
    const rule: AbuseRule = {
      id: 'test-rule',
      check: (ctx) => ctx.ip === '5.6.7.8',
      action,
    };
    const detector = new AbuseDetector({ rules: [rule] });
    const context: AbuseContext = { ip: '1.2.3.4' };
    const abused = await detector.check(context);
    expect(abused).toBe(false);
    expect(action).not.toHaveBeenCalled();
  });
});

describe('abuseMiddleware', () => {
  it('should call next if no abuse', async () => {
    const rule: AbuseRule = {
      id: 'test',
      check: () => false,
      action: vi.fn(),
    };
    const detector = new AbuseDetector({ rules: [rule] });
    const req: any = { ip: '1.2.3.4', headers: {}, abuseContext: {} };
    const res: any = { status: vi.fn().mockReturnThis(), send: vi.fn() };
    const next = vi.fn();
    await abuseMiddleware(detector)(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should send 429 if abuse detected', async () => {
    const rule: AbuseRule = {
      id: 'test',
      check: () => true,
      action: vi.fn(),
    };
    const detector = new AbuseDetector({ rules: [rule] });
    const req: any = { ip: '1.2.3.4', headers: {}, abuseContext: {} };
    const res: any = { status: vi.fn().mockReturnThis(), send: vi.fn() };
    const next = vi.fn();
    await abuseMiddleware(detector)(req, res, next);
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.send).toHaveBeenCalledWith('Too Many Requests or Abuse Detected');
    expect(next).not.toHaveBeenCalled();
  });
}); 