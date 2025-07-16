# backend-suite

A monorepo of professional, production-ready backend packages for Node.js/TypeScript.

## Packages

- **@backend-suite/ai-cli-tools**: AI-powered CLI tools for code audit, explanation, and test generation.
- **@backend-suite/api-security**: Security utilities for API authentication, authorization, and protection.
- **@backend-suite/auth-core**: Core authentication logic (passwords, tokens, etc.).
- **@backend-suite/auth-kit**: Ready-to-use authentication middleware and helpers.
- **@backend-suite/dev-mirror**: API mocking and development utilities.
- **@backend-suite/env-crypto**: Secure environment variable encryption/decryption.
- **@backend-suite/event-bus**: Event-driven architecture utilities.
- **@backend-suite/file-handler**: File upload, download, and storage utilities.
- **@backend-suite/json-schema-tools**: JSON Schema conversion and validation tools.
- **@backend-suite/logger**: Structured logging utilities.
- **@backend-suite/multitenant-db**: Multi-tenant database connection and pooling.
- **@backend-suite/query-linter**: Query linting and beautification for SQL, MongoDB, JSON.
- **@backend-suite/queue-worker**: Queue processing and background job utilities.
- **@backend-suite/rate-limiter**: Rate limiting middleware and utilities.
- **@backend-suite/request-validator**: Request/response validation middleware.
- **@backend-suite/schema-manager**: Schema management and migration utilities.
- **@backend-suite/test-kit**: Test utilities and fixtures for backend packages.
- **@backend-suite/webhook-center**: Webhook management and delivery utilities.
- **@backend-suite/abuse-detector**: Extensible abuse detection and prevention toolkit (rate limiting, fingerprinting, anomaly detection, rules engine).

## Example Usage: Abuse Detector
```ts
import { AbuseDetector, abuseMiddleware } from '@backend-suite/abuse-detector';

const detector = new AbuseDetector({
  rules: [/* ... */],
  storage: /* ... */
});

// Express example
app.use(abuseMiddleware(detector));
```

## Usage Examples

### @backend-suite/ai-cli-tools
```sh
ai-cli audit <file>
ai-cli explain <file|function>
ai-cli testgen <file>
```

### @backend-suite/api-security
```ts
import { scanApi } from '@backend-suite/api-security';
const report = scanApi({ endpoint: '/users', method: 'POST', payload: {} });
```

### @backend-suite/auth-core
```ts
import { registerUser, authenticateUser, hashPassword, verifyPassword, generateJWT, verifyJWT } from '@backend-suite/auth-core';
const user = registerUser('alice', 'password123', { email: 'alice@example.com' });
const result = authenticateUser('alice', 'password123');
if (result) {
  console.log('Access token:', result.accessToken);
}
const hash = hashPassword('secret');
const valid = verifyPassword('secret', hash);
const token = generateJWT(user, 'mysecret');
const payload = verifyJWT(token, 'mysecret');
```

### @backend-suite/auth-kit
```ts
import { createAuth, verifyToken } from '@backend-suite/auth-kit';
const auth = createAuth({ strategy: 'jwt', secret: '...' });
const user = verifyToken('token');
```

### @backend-suite/dev-mirror
```ts
import { createApiMock, createDbMock } from '@backend-suite/dev-mirror';
const api = createApiMock({ endpoints: [/* ... */] });
const db = createDbMock({ tables: [/* ... */] });
```

### @backend-suite/env-crypto
```ts
import { encryptEnvFile, decryptEnvFile } from '@backend-suite/env-crypto';
encryptEnvFile('.env', '.env.enc', 'password');
decryptEnvFile('.env.enc', '.env', 'password');
```

### @backend-suite/event-bus
```ts
import { createEventBus } from '@backend-suite/event-bus';
const bus = createEventBus({ provider: 'kafka', config: {/* ... */} });
bus.publish('user.created', { id: 1 });
bus.subscribe('user.created', (payload) => {/* ... */});
```

### @backend-suite/json-schema-tools
```ts
import { tsToJsonSchema, jsonSchemaToTs } from '@backend-suite/json-schema-tools';
const schema = tsToJsonSchema('User', './types.ts');
const ts = jsonSchemaToTs(schema);
```

### @backend-suite/logger
```ts
import { createLogger } from '@backend-suite/logger';
const logger = createLogger('my-service', { level: 'info' });
logger.info('Hello, world!');
```

### @backend-suite/multitenant-db
```ts
import { getTenantDb, tenantDbMiddleware } from '@backend-suite/multitenant-db';
// MySQL
const mysqlConn = await getTenantDb('org_123');
// MongoDB
const mongoDb = await getTenantDb('org_456');
// Express middleware
app.use(tenantDbMiddleware({ jwtSecret: 'your_jwt_secret' }));
```

### @backend-suite/query-linter
```ts
import { lintQuery, beautifyQuery } from '@backend-suite/query-linter';
const sql = 'SELECT * FROM table WHERE id = 1';
const errors = await lintQuery(sql, 'sql', { sqlDialect: 'postgres' });
console.log(errors);
console.log(beautifyQuery(sql, 'sql'));
```

### @backend-suite/queue-worker
```ts
import { addJob, processQueue } from '@backend-suite/queue-worker';
addJob('emails', { to: 'alice@example.com', subject: 'Welcome!' });
processQueue('emails', async (job) => {
  // send email logic
  console.log('Processing job:', job);
}, 2, 3); // concurrency: 2, maxRetries: 3
```

### @backend-suite/rate-limiter
```ts
import { createTokenBucketLimiter, expressRateLimiter } from '@backend-suite/rate-limiter';
const limiter = createTokenBucketLimiter({ tokensPerInterval: 10, interval: 'minute' });
app.use(expressRateLimiter({ limiter }));
```

### @backend-suite/request-validator
```ts
import { validateRequest } from '@backend-suite/request-validator';
const schema = {/* ... */};
const result = validateRequest(schema, req.body);
```

### @backend-suite/schema-manager
```ts
import { diffSchemas, syncSchemas, generateMigration } from '@backend-suite/schema-manager';
const current = { id: 'number', name: 'string' };
const next = { id: 'number', name: 'string', email: 'string' };
const diff = diffSchemas(current, next);
const synced = syncSchemas(current, next);
const migration = generateMigration(current, next);
```

### @backend-suite/test-kit
```ts
import { mockRequest, mockResponse, seedDatabase } from '@backend-suite/test-kit';
const req = mockRequest({ method: 'GET' });
const res = mockResponse();
seedDatabase({ users: [{ id: 1, name: 'Alice' }] });
```

### @backend-suite/webhook-center
```ts
import { registerWebhook, unregisterWebhook, deliverEvent } from '@backend-suite/webhook-center';
registerWebhook('https://example.com/webhook', ['user.created']);
await deliverEvent('user.created', { id: 1, name: 'Alice' });
unregisterWebhook('https://example.com/webhook');
```

### @backend-suite/abuse-detector
```ts
import { AbuseDetector, abuseMiddleware } from '@backend-suite/abuse-detector';
const detector = new AbuseDetector({
  rules: [/* ... */],
  storage: /* ... */
});
app.use(abuseMiddleware(detector));
```

## Getting Started
- Each package contains its own README with detailed usage and API docs.
- Use `pnpm` to install dependencies and run scripts.

## License
MIT