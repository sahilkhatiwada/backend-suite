# @backend-suite/logger

Structured logger with Pino wrapper, multiple output modes, and named instances.

## Features
- Structured logging (Pino default, Winston optional)
- Named logger instances
- JSON, pretty, and file transports
- Ready for APM/Sentry integration

## Usage

### Programmatic
```ts
import { createLogger, getLogger } from '@backend-suite/logger';

const logger = createLogger('my-service', { level: 'info' });
logger.info('Hello, world!');

const sameLogger = getLogger('my-service');
sameLogger.error('Something went wrong');
```

## API
- `createLogger(name, options)`
- `getLogger(name)` 