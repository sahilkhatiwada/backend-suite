import { describe, it, expect, vi } from 'vitest';
import { registerWebhook, unregisterWebhook, deliverEvent } from '../src';

describe('webhook-center', () => {
  it('registers and unregisters webhooks', () => {
    registerWebhook('http://example.com/a', ['foo']);
    registerWebhook('http://example.com/b', ['bar']);
    unregisterWebhook('http://example.com/a');
    // No direct way to check, but should not throw
  });

  it('delivers events to registered webhooks', async () => {
    registerWebhook('http://example.com/c', ['event1']);
    const fetchMock = vi.fn().mockResolvedValue({});
    vi.stubGlobal('fetch', fetchMock);
    await deliverEvent('event1', { x: 1 });
    expect(fetchMock).toHaveBeenCalledWith('http://example.com/c', expect.anything());
    vi.unstubAllGlobals();
  });
}); 