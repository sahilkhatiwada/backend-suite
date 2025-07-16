# @backend-suite/test-kit

Backend testing utilities: mock req/res, seed DBs, snapshot testing.

## Purpose
Simplify backend testing with utilities for mocking, seeding, and snapshotting.

## Features
- Mock Express/Fastify/Koa req/res objects
- Seed SQL/NoSQL databases
- Snapshot API responses
- Integrate with popular test runners

## Usage
```ts
import { mockRequest, mockResponse, seedDatabase } from '@backend-suite/test-kit';

const req = mockRequest({ method: 'GET' });
const res = mockResponse();
seedDatabase({ users: [{ id: 1, name: 'Alice' }] });
```

## License
MIT 