# @backend-suite/dev-mirror

Mock external APIs and simulate databases for development and testing.

## Purpose
Easily create mock endpoints and database behaviors to speed up backend and integration testing.

## Features
- Mock REST and GraphQL APIs
- Simulate SQL/NoSQL database responses
- Configurable latency, errors, and data
- Useful for local development, CI, and demos

## Usage
```ts
import { createApiMock, createDbMock } from '@backend-suite/dev-mirror';

const api = createApiMock({ endpoints: [/* ... */] });
const db = createDbMock({ tables: [/* ... */] });
```

## License
MIT 