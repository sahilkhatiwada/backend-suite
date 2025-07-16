/**
 * @packageDocumentation
 * @module @backend-suite/multitenant-db
 *
 * Multi-tenant database connection manager for Node.js backends.
 * Supports dynamic DB switching (MySQL, PostgreSQL, MongoDB, Redis) per tenant, JWT-based middleware, and connection pooling.
 */

import mysql, { Pool as MySqlPool, PoolConnection as MySqlConnection } from 'mysql2/promise';
import { MongoClient, Db as MongoDb } from 'mongodb';
import { Pool as PgPool, PoolClient as PgConnection } from 'pg';
import { createClient as createRedisClient, RedisClientType } from 'redis';
import jwt from 'jsonwebtoken';

/** Supported database types */
export type TenantDbType = 'mysql' | 'postgres' | 'mongodb' | 'redis';

/**
 * Tenant database configuration
 */
export interface TenantDbConfig {
  tenantId: string;
  type: TenantDbType;
  uri: string; // Connection string for all DBs
  dbName?: string; // For MongoDB/Postgres
  user?: string;
  password?: string;
}

/**
 * Connection types for supported DBs
 */
export type MySQLConnection = MySqlConnection;
export type PostgresConnection = PgConnection;
export type MongoDBConnection = MongoDb;
export type RedisConnection = RedisClientType<any, any, any>;

/**
 * Custom error for tenant DB issues
 */
export class TenantDbError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TenantDbError';
  }
}

/**
 * Custom error for authentication issues
 */
export class TenantAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TenantAuthError';
  }
}

/**
 * In-memory central config DB (replace with real DB/service in production)
 */
const tenantConfigDb: Record<string, TenantDbConfig> = {
  'org_123': {
    tenantId: 'org_123',
    type: 'mysql',
    uri: 'mysql://user:pass@localhost:3306/org_123_db',
  },
  'org_456': {
    tenantId: 'org_456',
    type: 'mongodb',
    uri: 'mongodb://localhost:27017',
    dbName: 'org_456_db',
  },
  'org_pg': {
    tenantId: 'org_pg',
    type: 'postgres',
    uri: 'postgresql://user:pass@localhost:5432/org_pg_db',
  },
  'org_redis': {
    tenantId: 'org_redis',
    type: 'redis',
    uri: 'redis://localhost:6379',
  },
};

/**
 * Fetch tenant DB config from central config DB
 * Override this function to fetch from a real DB or config service.
 */
export async function fetchTenantDbConfig(tenantId: string): Promise<TenantDbConfig | undefined> {
  // TODO: Replace with real DB fetch in production
  return tenantConfigDb[tenantId];
}

/**
 * Internal connection pools/caches
 */
const mysqlPools: Record<string, MySqlPool> = {};
const pgPools: Record<string, PgPool> = {};
const mongoClients: Record<string, MongoClient> = {};
const redisClients: Record<string, RedisConnection> = {};

/**
 * Get a database connection for a given tenant.
 * @param tenantId - The tenant's unique identifier
 * @returns MySQL, PostgreSQL, MongoDB, or Redis connection instance
 * @throws TenantDbError if config is missing or DB type is unsupported
 */
export async function getTenantDb(
  tenantId: string
): Promise<MySQLConnection | PostgresConnection | MongoDBConnection | RedisConnection> {
  const config = await fetchTenantDbConfig(tenantId);
  if (!config) throw new TenantDbError(`No DB config found for tenant: ${tenantId}`);

  switch (config.type) {
    case 'mysql': {
      if (!mysqlPools[tenantId]) {
        mysqlPools[tenantId] = mysql.createPool(config.uri);
      }
      return mysqlPools[tenantId].getConnection();
    }
    case 'postgres': {
      if (!pgPools[tenantId]) {
        pgPools[tenantId] = new PgPool({ connectionString: config.uri });
      }
      return pgPools[tenantId].connect();
    }
    case 'mongodb': {
      if (!mongoClients[tenantId]) {
        mongoClients[tenantId] = new MongoClient(config.uri);
        await mongoClients[tenantId].connect();
      }
      if (!config.dbName) throw new TenantDbError('Missing dbName for MongoDB tenant');
      return mongoClients[tenantId].db(config.dbName);
    }
    case 'redis': {
      if (!redisClients[tenantId]) {
        redisClients[tenantId] = createRedisClient({ url: config.uri });
        await redisClients[tenantId].connect();
      }
      return redisClients[tenantId];
    }
    default:
      throw new TenantDbError(`Unsupported DB type: ${config.type}`);
  }
}

/**
 * Options for tenantDbMiddleware
 */
export interface TenantDbMiddlewareOptions {
  jwtSecret: string;
  /**
   * Optionally override how the tenantId is extracted from the JWT payload
   * @default (payload) => payload.tenantId
   */
  getTenantIdFromPayload?: (payload: any) => string;
  /**
   * Optionally override how the DB connection is attached to the request
   * @default (req, db) => { req.tenantDb = db; }
   */
  attachDbToRequest?: (req: any, db: MySQLConnection | PostgresConnection | MongoDBConnection | RedisConnection) => void;
}

/**
 * Framework-agnostic middleware to attach tenant DB connection to the request object.
 * - Expects JWT in Authorization header (Bearer token)
 * - JWT payload must have tenantId (or use getTenantIdFromPayload)
 * - Attaches DB connection to req.tenantDb (or use attachDbToRequest)
 *
 * @param options - Middleware options
 */
export function tenantDbMiddleware(options: TenantDbMiddlewareOptions) {
  const {
    jwtSecret,
    getTenantIdFromPayload = (payload: any) => payload.tenantId,
    attachDbToRequest = (req: any, db: any) => { req.tenantDb = db; },
  } = options;

  return async function (req: any, res: any, next: any) {
    try {
      const auth = req.headers['authorization'] || req.headers['Authorization'];
      if (!auth || !auth.startsWith('Bearer ')) throw new TenantAuthError('Missing Bearer token');
      const token = auth.slice(7);
      const payload = jwt.verify(token, jwtSecret) as any;
      const tenantId = getTenantIdFromPayload(payload);
      if (!tenantId) throw new TenantAuthError('No tenantId in JWT payload');
      const db = await getTenantDb(tenantId);
      attachDbToRequest(req, db);
      next();
    } catch (err: any) {
      // Optionally log error here
      if (res && typeof res.status === 'function' && typeof res.json === 'function') {
        res.status(401).json({ error: 'Unauthorized', details: err.message });
      } else if (typeof next === 'function') {
        next(err);
      }
    }
  };
}

// TODO: Add graceful shutdown/cleanup for pools/clients if needed 