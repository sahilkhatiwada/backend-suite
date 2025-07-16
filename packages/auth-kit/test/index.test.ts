import { describe, it, expect } from 'vitest';
import { createAuth, verifyToken } from '../src';

describe('@backend-suite/auth-kit', () => {
  const secret = 'test_secret';
  const auth = createAuth({ strategy: 'jwt', secret, expiresIn: '1h' });

  it('should create an auth instance', () => {
    expect(auth).toHaveProperty('sign');
    expect(auth).toHaveProperty('verify');
    expect(auth).toHaveProperty('hasRole');
  });

  it('should sign and verify a token', () => {
    const payload = { userId: 123, roles: ['admin'] };
    const token = auth.sign(payload);
    const decoded = auth.verify(token) as any;
    expect(decoded.userId).toBe(123);
    expect(decoded.roles).toContain('admin');
  });

  it('should return null for invalid token', () => {
    expect(auth.verify('invalid.token')).toBeNull();
  });

  it('should check user roles', () => {
    expect(auth.hasRole({ roles: ['admin', 'user'] }, 'admin')).toBe(true);
    expect(auth.hasRole({ roles: ['user'] }, 'admin')).toBe(false);
    expect(auth.hasRole({}, 'admin')).toBe(false);
  });

  it('should verify a token with default secret (verifyToken)', () => {
    const token = createAuth({ strategy: 'jwt', secret: 'default_secret' }).sign({ foo: 'bar' });
    const decoded = verifyToken(token) as any;
    expect(decoded.foo).toBe('bar');
  });

  it('should return null for invalid token in verifyToken', () => {
    expect(verifyToken('invalid.token')).toBeNull();
  });
}); 