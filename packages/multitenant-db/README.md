# @backend-suite/multitenant-db

Dynamically switch databases per user or organization for multi-tenant architectures.

## Purpose
Enable scalable multi-tenant applications by managing and switching database connections on a per-user or per-organization basis.

## Features
- Dynamic database switching (MySQL & MongoDB)
- Central config DB for tenant connection info
- JWT-based middleware for Express/Fastify/Koa
- Connection pooling and caching
- TypeScript types and robust error handling

## Installation
```sh
pnpm add @backend-suite/multitenant-db mysql2 mongodb jsonwebtoken
```

## Central Config DB
Tenant DB connection info is fetched from a central config DB (in-memory by default, but you can replace with your own DB or service):

```ts
// Example config (src/index.ts)
const tenantConfigDb = {
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
};
```

You can replace `fetchTenantDbConfig` with your own logic to fetch from a real DB or service.

## Usage

### 1. Get a Tenant DB Connection
```ts
import { getTenantDb } from '@backend-suite/multitenant-db';

// MySQL
const mysqlConn = await getTenantDb('org_123'); // returns a MySQL connection (mysql2)

// MongoDB
const mongoDb = await getTenantDb('org_456'); // returns a MongoDB Db instance
```

### 2. Express/Fastify/Koa Middleware (JWT-based)
Attach the correct tenant DB connection to each request, based on the tenantId in the JWT:

```ts
import express from 'express';
import { tenantDbMiddleware } from '@backend-suite/multitenant-db';

const app = express();
app.use(tenantDbMiddleware({ jwtSecret: 'your_jwt_secret' }));

app.get('/data', async (req, res) => {
  const db = req.tenantDb; // MySQL or MongoDB connection
  // ... use db for queries ...
});
```
- The JWT must be sent as a Bearer token in the Authorization header.
- The JWT payload must include a `tenantId` field.

### 3. TypeScript Types
```ts
import type { MySQLConnection, MongoDBConnection } from '@backend-suite/multitenant-db';
```

## Testing
- Tests for MySQL and MongoDB connections will pass if you have local servers running at the URIs in the config.
- If not, tests will be skipped/log errors and still pass for middleware logic.
- To run tests:
```sh
pnpm test --filter @backend-suite/multitenant-db
```

## Advanced
- Swap out the in-memory config DB for your own DB or config service by replacing `fetchTenantDbConfig`.
- Supports connection pooling and caching for both MySQL and MongoDB.
- Robust error handling for missing configs, unsupported DBs, and JWT errors.

## License
MIT 