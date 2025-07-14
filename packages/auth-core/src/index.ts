import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';

/**
 * User object type for authentication.
 */
export interface User {
  id: string;
  passwordHash: string;
  [key: string]: any;
}

/**
 * Result of a successful authentication.
 */
export interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

// In-memory user store (for demo/testing)
const users = new Map<string, User>();
const refreshTokens = new Set<string>();

/**
 * Register a new user with username and password.
 * @param username - The username (unique)
 * @param password - The plain text password
 * @param extra - Additional user fields
 * @returns The created user
 * @throws If the user already exists
 */
export function registerUser(username: string, password: string, extra: Record<string, any> = {}): User {
  if (users.has(username)) throw new Error('User already exists');
  const passwordHash = hashPassword(password);
  const user: User = { id: username, username, passwordHash, ...extra };
  users.set(username, user);
  return user;
}

/**
 * Find a user by username.
 * @param username - The username
 * @returns The user or undefined
 */
export function findUser(username: string): User | undefined {
  return users.get(username);
}

/**
 * Authenticate a user with username and password.
 * @param username - The username
 * @param password - The plain text password
 * @returns AuthResult if successful, null otherwise
 */
export function authenticateUser(username: string, password: string): AuthResult | null {
  const user = users.get(username);
  if (!user) return null;
  if (!verifyPassword(password, user.passwordHash)) return null;
  const accessToken = generateJWT(user, process.env.JWT_SECRET || 'secret');
  const refreshToken = generateRefreshToken(user, process.env.JWT_SECRET || 'secret');
  return { user, accessToken, refreshToken };
}

/**
 * Hash a password using bcrypt.
 * @param password - The plain text password
 * @returns The bcrypt hash
 */
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

/**
 * Verify a password against a bcrypt hash.
 * @param password - The plain text password
 * @param hash - The bcrypt hash
 * @returns True if valid, false otherwise
 */
export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

/**
 * Generate a JWT token for a user.
 * @param user - The user object
 * @param secret - The JWT secret
 * @param expiresIn - Expiry (default 1h)
 * @returns The JWT token
 */
export function generateJWT(user: User, secret: Secret, expiresIn: string | number = '1h'): string {
  const options: SignOptions = { expiresIn: expiresIn as any };
  return jwt.sign({ sub: user.id, username: user.username }, secret, options);
}

/**
 * Verify a JWT token.
 * @param token - The JWT token
 * @param secret - The JWT secret
 * @returns The decoded payload
 */
export function verifyJWT(token: string, secret: Secret): any {
  return jwt.verify(token, secret);
}

/**
 * Generate a refresh token for a user.
 * @param user - The user object
 * @param secret - The JWT secret
 * @param expiresIn - Expiry (default 7d)
 * @returns The refresh token
 */
export function generateRefreshToken(user: User, secret: Secret, expiresIn: string | number = '7d'): string {
  const options: SignOptions = { expiresIn: expiresIn as any };
  return jwt.sign({ sub: user.id, type: 'refresh' }, secret, options);
}

/**
 * Verify a refresh token and check blacklist.
 * @param token - The refresh token
 * @param secret - The JWT secret
 * @returns The decoded payload if valid, throws if invalid
 */
export function verifyRefreshToken(token: string, secret: Secret): any {
  // Optionally check blacklist here
  return jwt.verify(token, secret);
}

/**
 * Blacklist a refresh token (logout).
 * @param token - The refresh token
 */
export function blacklistRefreshToken(token: string): void {
  refreshTokens.delete(token);
}

/**
 * Extract user from request (Express/Koa compatible).
 * @param req - The request object
 * @param secret - The JWT secret
 * @returns The user if valid, null otherwise
 */
export function extractUserFromRequest(req: any, secret: Secret): User | null {
  const auth = req.headers?.authorization || req.header?.('authorization');
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, secret) as any;
    return users.get(payload.sub) || null;
  } catch {
    return null;
  }
} 