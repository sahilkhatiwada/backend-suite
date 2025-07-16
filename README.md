# backend-suite

> Monorepo to Solve All Backend Developer Problems — One Unified Ecosystem

A single TypeScript-based monorepo offering modular, framework-agnostic, production-ready NPM packages under the scope `@backend-suite/*`.

Each package is designed to solve a specific backend pain point — from environment management, schema syncing, and rate limiting to structured logging, authentication, webhooks, job orchestration, multi-tenancy, validation, and more.

---

## Features
- Modular, composable packages for backend development
- TypeScript-first, strict settings
- Production-ready utilities: env encryption, rate limiting, logging, schema management, authentication, webhooks, queues, multi-tenancy, validation, and more
- Monorepo managed with TurboRepo and PNPM
- Shared linting and formatting (ESLint, Prettier)
- Comprehensive tests (Vitest) with robust automation and DB test skipping
- Automated versioning and publishing (Changesets, GitHub Actions)
- **All packages at version 0.2.0**

---

## Packages
- [`@backend-suite/env-crypto`](./packages/env-crypto) — .env encryption/decryption utilities
- [`@backend-suite/rate-limiter`](./packages/rate-limiter) — Token bucket, Redis adapter, Express/Koa middleware
- [`@backend-suite/logger`](./packages/logger) — Structured logging with Pino
- [`@backend-suite/auth-core`](./packages/auth-core) — In-memory user store, registration, authentication, JWT
- [`@backend-suite/auth-kit`](./packages/auth-kit) — Auth utilities and helpers (extension kit)
- [`@backend-suite/schema-manager`](./packages/schema-manager) — Schema diff, sync, migration generation
- [`@backend-suite/webhook-center`](./packages/webhook-center) — Webhook registration, delivery, retry
- [`@backend-suite/queue-worker`](./packages/queue-worker) — In-memory job queue, concurrency, retry
- [`@backend-suite/json-schema-tools`](./packages/json-schema-tools) — TypeScript ↔ JSON Schema conversion
- [`@backend-suite/query-linter`](./packages/query-linter) — Lint and beautify SQL, MongoDB, and JSON queries
- [`@backend-suite/api-security`](./packages/api-security) — Security utilities for APIs
- [`@backend-suite/dev-mirror`](./packages/dev-mirror) — Dev environment mirroring tools
- [`@backend-suite/event-bus`](./packages/event-bus) — Simple event bus for pub/sub
- [`@backend-suite/file-handler`](./packages/file-handler) — File upload/download helpers
- [`@backend-suite/multitenant-db`](./packages/multitenant-db) — Multi-tenant DB connection manager (MySQL, MongoDB, JWT middleware)
- [`@backend-suite/request-validator`](./packages/request-validator) — API input validation (Zod/Yup)
- [`@backend-suite/test-kit`](./packages/test-kit) — Backend testing utilities: mock req/res, seed DBs, snapshot testing

---

## Installation

```sh
pnpm install @backend-suite/<package>
```

See each package's README for usage and API details.

---

## Usage Example

```ts
// --- Authentication ---
import { registerUser, authenticateUser, generateJWT, verifyJWT } from '@backend-suite/auth-core';

const user = registerUser('alice', 'password123', { email: 'alice@example.com' });
const auth = authenticateUser('alice', 'password123');
if (auth) {
  const token = generateJWT(auth.user, 'mysecret');
  const payload = verifyJWT(token, 'mysecret');
  console.log('Authenticated:', payload);
}

// --- Schema Management ---
import { diffSchemas, syncSchemas, generateMigration } from '@backend-suite/schema-manager';

const schemaA = { id: 'int', name: 'string' };
const schemaB = { id: 'int', name: 'string', email: 'string' };
const diff = diffSchemas(schemaA, schemaB);
const synced = syncSchemas(schemaA, schemaB);
const migration = generateMigration(schemaA, schemaB);

// --- Rate Limiting (Express example) ---
import express from 'express';
import { rateLimiterMiddleware } from '@backend-suite/rate-limiter';

const app = express();
app.use(rateLimiterMiddleware({ tokensPerInterval: 10, interval: 'minute' }));

// --- Logging ---
import { createLogger } from '@backend-suite/logger';
const logger = createLogger('my-app');
logger.info('App started');

// --- Webhooks ---
import { registerWebhook, deliverEvent } from '@backend-suite/webhook-center';
registerWebhook('https://example.com/webhook', ['user.created']);
deliverEvent('user.created', { id: 1, name: 'Alice' });

// --- Queue Worker ---
import { addJob, processQueue } from '@backend-suite/queue-worker';
addJob('emails', { to: 'alice@example.com', subject: 'Welcome!' });
processQueue('emails', async (job) => {
  // send email logic
  console.log('Processing job:', job);
}, 2, 3); // concurrency: 2, maxRetries: 3

// --- Multi-Tenant DB (Express example) ---
import { tenantDbMiddleware } from '@backend-suite/multitenant-db';
app.use(tenantDbMiddleware({ jwtSecret: 'your_jwt_secret' }));
app.get('/data', async (req, res) => {
  const db = req.tenantDb; // MySQL or MongoDB connection
  // ... use db for queries ...
});

// --- Request Validation ---
import { validateRequest } from '@backend-suite/request-validator';
import { z } from 'zod';
const schema = z.object({ name: z.string(), age: z.number() });
const isValid = validateRequest(schema, { name: 'Alice', age: 30 });

// --- Test Kit ---
import { mockRequest, mockResponse, seedDatabase } from '@backend-suite/test-kit';
const req = mockRequest({ method: 'GET' });
const res = mockResponse();
seedDatabase({ users: [{ id: 1, name: 'Alice' }] });
```

---

## Monorepo Structure
- Managed with [TurboRepo](https://turbo.build/) and [PNPM](https://pnpm.io/)
- Shared base config: TypeScript, ESLint, Prettier
- Each package is independently versioned and published

---

## Contributing
- All packages must be in TypeScript
- Tests via Vitest (DB tests are skipped unless enabled)
- Build via tsup
- Follow Conventional Commits
- PRs and issues welcome!

---

## Versioning & Publishing
- Managed with [Changesets](https://github.com/changesets/changesets)
- Automated CI/CD with GitHub Actions
- Only necessary files are published to npm (see `.npmignore`)

---

## License
MIT