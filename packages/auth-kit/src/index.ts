/**
 * @packageDocumentation
 * @module @backend-suite/auth-kit
 *
 * Modular authentication toolkit: JWT, OAuth2, RBAC, scopes.
 */
import jwt from 'jsonwebtoken';

export interface AuthConfig {
  strategy: 'jwt';
  secret: string;
  expiresIn?: string | number;
  roles?: string[];
}

export interface AuthInstance {
  sign(payload: object, options?: { expiresIn?: string | number }): string;
  verify(token: string): object | null;
  hasRole(user: { roles?: string[] }, role: string): boolean;
}

/**
 * Creates an authentication instance (JWT only for now).
 */
export function createAuth(config: AuthConfig): AuthInstance {
  if (config.strategy !== 'jwt') throw new Error('Only JWT strategy is supported in this version.');
  return {
    sign(payload, options) {
      let expiresIn: string | number | undefined = '1h';
      if (options && typeof options.expiresIn !== 'undefined') expiresIn = options.expiresIn;
      else if (typeof config.expiresIn !== 'undefined') expiresIn = config.expiresIn;
      const signOptions: jwt.SignOptions = {};
      if (expiresIn !== undefined) signOptions.expiresIn = expiresIn as any;
      return jwt.sign({ ...payload }, config.secret, signOptions);
    },
    verify(token) {
      try {
        return jwt.verify(token, config.secret) as object;
      } catch {
        return null;
      }
    },
    hasRole(user, role) {
      return Array.isArray(user.roles) && user.roles.includes(role);
    },
  };
}

/**
 * Verifies a JWT token using a default secret (for demo/testing only).
 */
export function verifyToken(token: string): object | null {
  const secret = 'default_secret';
  try {
    return jwt.verify(token, secret) as object;
  } catch {
    return null;
  }
} 