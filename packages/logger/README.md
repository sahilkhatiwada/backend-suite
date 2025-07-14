# @backend-suite/logger

> Part of the [backend-suite](https://github.com/your-org/backend-suite) monorepo — a unified ecosystem of modular, production-ready backend utilities.

## Packages in the Suite
- [@backend-suite/env-crypto](../env-crypto)
- [@backend-suite/rate-limiter](../rate-limiter)
- [@backend-suite/logger](../logger)

## How to Use Multiple Packages
Install any package you need:
```sh
pnpm add @backend-suite/env-crypto @backend-suite/rate-limiter @backend-suite/logger
```

Import and use in your project:
```ts
import { encryptEnvFile } from '@backend-suite/env-crypto';
import { createTokenBucketLimiter } from '@backend-suite/rate-limiter';
import { createLogger } from '@backend-suite/logger';
```

## Versioning
This package is versioned independently using [Changesets](https://github.com/changesets/changesets). See the monorepo root for release and changelog management.

---

Structured logger with Pino wrapper, multiple output modes, and named instances.

## Features
- Structured logging (Pino default, Winston optional)
- Named logger instances
- JSON, pretty, and file transports
- Ready for APM/Sentry integration

## Installation
```sh
pnpm add @backend-suite/logger
```

## Usage

### Basic
```ts
import { createLogger } from '@backend-suite/logger';
const logger = createLogger('my-service', { level: 'info' });
logger.info('Hello, world!');
```

### Pretty Output
```ts
const logger = createLogger('pretty', { pretty: true });
logger.info('Pretty log!');
```

### File Output
```ts
const logger = createLogger('file', { file: './logs/app.log' });
logger.info('This goes to a file');
```

### Get Logger by Name
```ts
import { getLogger } from '@backend-suite/logger';
const logger = getLogger('my-service');
```

## API
- `createLogger(name, options)`
- `getLogger(name)`

## License
MIT 