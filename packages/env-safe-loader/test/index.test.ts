import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loadEnv } from '../src';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';

const TEST_ENV = path.join(__dirname, '.env');
const TEST_ENV_DEV = path.join(__dirname, '.env.development');
const TEST_EXAMPLE = path.join(__dirname, '.env.example');

const schema = z.object({
  DB_HOST: z.string(),
  DB_PORT: z.string().default('5432'),
  API_KEY: z.string(),
});

beforeEach(() => {
  fs.writeFileSync(TEST_ENV, 'DB_HOST=localhost\nAPI_KEY=abc123\n');
  fs.writeFileSync(TEST_ENV_DEV, 'DB_HOST=devhost\n');
  if (fs.existsSync(TEST_EXAMPLE)) fs.unlinkSync(TEST_EXAMPLE);
});
afterEach(() => {
  [TEST_ENV, TEST_ENV_DEV, TEST_EXAMPLE].forEach(f => {
    if (fs.existsSync(f)) fs.unlinkSync(f);
  });
});

describe('env-safe-loader', () => {
  it('loads and validates env vars', () => {
    process.env = {};
    const env = loadEnv({ schema, envFile: TEST_ENV });
    expect(env.DB_HOST).toBe('localhost');
    expect(env.API_KEY).toBe('abc123');
    expect(env.DB_PORT).toBe('5432');
  });

  it('merges .env and .env.development', () => {
    process.env = { NODE_ENV: 'development' };
    const env = loadEnv({ schema, envFile: TEST_ENV, envName: 'development' });
    expect(env.DB_HOST).toBe('devhost');
    expect(env.API_KEY).toBe('abc123');
  });

  it('generates .env.example with masking', () => {
    process.env = {};
    loadEnv({ schema, envFile: TEST_ENV, exampleFile: TEST_EXAMPLE });
    const example = fs.readFileSync(TEST_EXAMPLE, 'utf8');
    expect(example).toContain('DB_HOST=');
    expect(example).toContain('API_KEY=****');
  });

  it('throws in production if missing required', () => {
    process.env = { NODE_ENV: 'production' };
    expect(() => loadEnv({ schema, envFile: TEST_ENV_DEV, envName: 'production' })).toThrow();
  });
}); 