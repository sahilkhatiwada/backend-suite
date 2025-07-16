import { describe, it, expect, vi } from 'vitest';
import { createEventBus, EventBusConfig } from '../src';

describe('@backend-suite/event-bus', () => {
  const config: EventBusConfig = { provider: 'in-memory' };

  it('should publish and subscribe to events', async () => {
    const bus = createEventBus(config);
    const handler = vi.fn();
    bus.subscribe('test.event', handler);
    await bus.publish('test.event', { foo: 123 });
    expect(handler).toHaveBeenCalledWith({ foo: 123 });
  });

  it('should support multiple handlers for the same event', async () => {
    const bus = createEventBus(config);
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    bus.subscribe('multi.event', handler1);
    bus.subscribe('multi.event', handler2);
    await bus.publish('multi.event', { bar: 456 });
    expect(handler1).toHaveBeenCalledWith({ bar: 456 });
    expect(handler2).toHaveBeenCalledWith({ bar: 456 });
  });

  it('should support async handlers', async () => {
    const bus = createEventBus(config);
    let called = false;
    bus.subscribe('async.event', async (payload: any) => {
      await new Promise((r) => setTimeout(r, 10));
      called = payload.value;
    });
    await bus.publish('async.event', { value: true });
    expect(called).toBe(true);
  });

  it('should be type-safe for payloads', async () => {
    type UserCreated = { id: number; name: string };
    const bus = createEventBus(config);
    let received: UserCreated | undefined;
    bus.subscribe<UserCreated>('user.created', (payload) => {
      received = payload;
    });
    await bus.publish<UserCreated>('user.created', { id: 1, name: 'Alice' });
    expect(received).toEqual({ id: 1, name: 'Alice' });
  });
}); 