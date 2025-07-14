# backend-suite

> Monorepo to Solve All Backend Developer Problems — One Unified Ecosystem

A single TypeScript-based monorepo offering modular, framework-agnostic, production-ready NPM packages under the scope `@backend-suite/*`.

Each package is designed to solve a specific backend pain point — from environment management, schema syncing, and rate limiting to structured logging, authentication, webhooks, and job orchestration.

---

## Features
- Modular, composable packages for backend development
- TypeScript-first, strict settings
- Production-ready utilities: env encryption, rate limiting, logging, schema management, authentication, webhooks, queues, and more
- Monorepo managed with TurboRepo and PNPM
- Shared linting and formatting (ESLint, Prettier)
- Comprehensive tests (Vitest)
- Automated versioning and publishing (Changesets, GitHub Actions)

---

## Packages
- [`@backend-suite/env-crypto`](./packages/env-crypto) — .env encryption/decryption utilities
- [`@backend-suite/rate-limiter`](./packages/rate-limiter) — Token bucket, Redis adapter, Express/Koa middleware
- [`@backend-suite/logger`](./packages/logger) — Structured logging with Pino
- [`@backend-suite/auth-core`](./packages/auth-core) — In-memory user store, registration, authentication, JWT
- [`@backend-suite/schema-manager`](./packages/schema-manager) — Schema diff, sync, migration generation
- [`@backend-suite/webhook-center`](./packages/webhook-center) — Webhook registration, delivery, retry
- [`@backend-suite/queue-worker`](./packages/queue-worker) — In-memory job queue, concurrency, retry

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
```

---

## Monorepo Structure
- Managed with [TurboRepo](https://turbo.build/) and [PNPM](https://pnpm.io/)
- Shared base config: TypeScript, ESLint, Prettier
- Each package is independently versioned and published

---

## Contributing
- All packages must be in TypeScript
- Tests via Vitest
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