import { describe, it, expect } from 'vitest';
import {
  registerUser,
  findUser,
  authenticateUser,
  hashPassword,
  verifyPassword,
  generateJWT,
  verifyJWT,
  generateRefreshToken,
  verifyRefreshToken,
  blacklistRefreshToken,
  extractUserFromRequest,
} from '../src';

const SECRET = 'test-secret';

describe('auth-core', () => {
  it('registers and finds a user', () => {
    const user = registerUser('alice', 'password123');
    expect(user.username).toBe('alice');
    expect(findUser('alice')).toEqual(user);
  });

  it('hashes and verifies passwords', () => {
    const hash = hashPassword('secret');
    expect(verifyPassword('secret', hash)).toBe(true);
    expect(verifyPassword('wrong', hash)).toBe(false);
  });

  it('authenticates a user and issues tokens', () => {
    registerUser('bob', 'pw');
    const result = authenticateUser('bob', 'pw');
    expect(result).toBeTruthy();
    if (result) {
      expect(result.user.username).toBe('bob');
      expect(typeof result.accessToken).toBe('string');
      expect(typeof result.refreshToken).toBe('string');
    }
  });

  it('generates and verifies JWT', () => {
    const user = { id: 'u1', username: 'u1', passwordHash: '' };
    const token = generateJWT(user, SECRET);
    const payload = verifyJWT(token, SECRET);
    expect(payload.sub).toBe('u1');
  });

  it('generates, verifies, and blacklists refresh tokens', () => {
    const user = registerUser('u2', 'pw');
    const token = generateRefreshToken(user, SECRET);
    expect(verifyRefreshToken(token, SECRET)?.id).toBe('u2');
    blacklistRefreshToken(token);
    expect(verifyRefreshToken(token, SECRET)).toBeNull();
  });

  it('extracts user from request', () => {
    const user = registerUser('eve', 'pw');
    const token = generateJWT(user, SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    expect(extractUserFromRequest(req, SECRET)?.username).toBe('eve');
  });
}); 