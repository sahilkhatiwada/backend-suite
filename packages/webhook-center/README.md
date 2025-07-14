# @backend-suite/webhook-center

Centralized webhook management and delivery for Node.js/TypeScript monorepos. Register, unregister, and deliver events to webhooks with retry logic.

## Features
- Register/unregister webhooks for events
- Deliver events to registered webhooks (with retry)
- In-memory store (for demo/testing)
- TypeScript types and JSDoc

## Installation

```sh
pnpm add @backend-suite/webhook-center
```

## Usage

```ts
import { registerWebhook, unregisterWebhook, deliverEvent } from '@backend-suite/webhook-center';

registerWebhook('https://example.com/webhook', ['user.created']);

await deliverEvent('user.created', { id: 1, name: 'Alice' });

unregisterWebhook('https://example.com/webhook');
```

## API

See full JSDoc in source. Main exports:
- `registerWebhook(url, events)`
- `unregisterWebhook(url)`
- `deliverEvent(event, payload, maxRetries?)`

## Monorepo Usage
This package is part of the `backend-suite` monorepo. Use with other packages for full-stack backend development.

## Versioning & Releases
Managed with [Changesets](https://github.com/changesets/changesets). See root README for release workflow.

## License
MIT 