# @backend-suite/logger

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