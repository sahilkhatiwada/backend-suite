# @backend-suite/abuse-detector

Extensible abuse detection and prevention toolkit for backend services.

## Features
- Rate limiting (IP, user, custom keys)
- Fingerprinting (IP, user agent, device)
- Anomaly detection hooks
- Extensible rules engine
- Middleware for Express/Fastify/Koa
- Customizable storage (in-memory, Redis, etc.)

## Installation
```sh
pnpm add @backend-suite/abuse-detector
```

## Usage
```ts
import { AbuseDetector, abuseMiddleware } from '@backend-suite/abuse-detector';

const detector = new AbuseDetector({
  rules: [/* ... */],
  storage: /* ... */
});

// Express example
app.use(abuseMiddleware(detector));
```

## Extensibility
- Add custom rules and anomaly hooks
- Plug in your own storage backend
- Integrate with logging/alerting systems

## License
MIT 