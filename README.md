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

## Getting Started
- Each package contains its own README with detailed usage and API docs.
- Use `pnpm` to install dependencies and run scripts.

## License
MIT