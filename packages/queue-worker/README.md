# @backend-suite/queue-worker

Job and queue processing utilities for Node.js/TypeScript monorepos. Add jobs, process with concurrency, and handle retries.

## Features
- In-memory job queues (for demo/testing)
- Add jobs to named queues
- Process jobs with concurrency and retry
- TypeScript types and JSDoc

## Installation

```sh
pnpm add @backend-suite/queue-worker
```

## Usage

```ts
import { addJob, processQueue } from '@backend-suite/queue-worker';

addJob('emails', { to: 'alice@example.com', subject: 'Welcome!' });

processQueue('emails', async (job) => {
  // send email logic
  console.log('Processing job:', job);
}, 2, 3); // concurrency: 2, maxRetries: 3
```

## API

See full JSDoc in source. Main exports:
- `addJob(queue, job)`
- `processQueue(queue, handler, concurrency?, maxRetries?)`

## Monorepo Usage
This package is part of the `backend-suite` monorepo. Use with other packages for full-stack backend development.

## Versioning & Releases
Managed with [Changesets](https://github.com/changesets/changesets). See root README for release workflow.

## License
MIT 