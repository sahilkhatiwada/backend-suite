# @backend-suite/event-bus

Event-driven microservice SDK: Kafka, NATS, RabbitMQ abstraction.

## Purpose
Simplify event-driven architecture by providing a unified API for popular message brokers.

## Features
- Publish and subscribe to events
- Unified API for Kafka, NATS, RabbitMQ
- Middleware and hooks for microservices
- Type-safe event payloads

## Usage
```ts
import { createEventBus } from '@backend-suite/event-bus';

const bus = createEventBus({ provider: 'kafka', config: {/* ... */} });
bus.publish('user.created', { id: 1 });
bus.subscribe('user.created', (payload) => {/* ... */});
```

## License
MIT 