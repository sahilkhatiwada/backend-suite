/**
 * @packageDocumentation
 * @module @backend-suite/event-bus
 *
 * Event-driven microservice SDK: Kafka, NATS, RabbitMQ abstraction.
 */

export type EventHandler<T = any> = (payload: T) => void | Promise<void>;

interface EventBusProvider {
  publish<T>(event: string, payload: T): Promise<void>;
  subscribe<T>(event: string, handler: EventHandler<T>): void;
}

class InMemoryEventBus implements EventBusProvider {
  private handlers: Map<string, EventHandler<any>[]> = new Map();

  async publish<T>(event: string, payload: T): Promise<void> {
    const handlers = this.handlers.get(event) || [];
    for (const handler of handlers) {
      await handler(payload);
    }
  }

  subscribe<T>(event: string, handler: EventHandler<T>): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler as EventHandler<any>);
  }
}

export interface EventBusConfig {
  provider: 'in-memory' | 'kafka' | 'nats' | 'rabbitmq';
  config?: any;
}

export interface EventBus {
  publish<T>(event: string, payload: T): Promise<void>;
  subscribe<T>(event: string, handler: EventHandler<T>): void;
}

export function createEventBus(config: EventBusConfig): EventBus {
  let provider: EventBusProvider;
  switch (config.provider) {
    case 'in-memory':
      provider = new InMemoryEventBus();
      break;
    // case 'kafka':
    //   provider = new KafkaEventBus(config.config);
    //   break;
    // case 'nats':
    //   provider = new NatsEventBus(config.config);
    //   break;
    // case 'rabbitmq':
    //   provider = new RabbitMqEventBus(config.config);
    //   break;
    default:
      throw new Error(`Unsupported provider: ${config.provider}`);
  }
  return {
    publish: provider.publish.bind(provider),
    subscribe: provider.subscribe.bind(provider),
  };
} 