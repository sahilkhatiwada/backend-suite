import fetch from 'node-fetch';

/**
 * Webhook registration object.
 */
interface Webhook {
  url: string;
  events: string[];
}

const webhooks: Webhook[] = [];

/**
 * Register a webhook endpoint for specific events.
 * @param url - The webhook endpoint URL
 * @param events - List of event names to subscribe to
 */
export function registerWebhook(url: string, events: string[]): void {
  if (webhooks.find((w) => w.url === url)) return;
  webhooks.push({ url, events });
}

/**
 * Unregister a webhook endpoint.
 * @param url - The webhook endpoint URL
 */
export function unregisterWebhook(url: string): void {
  const idx = webhooks.findIndex((w) => w.url === url);
  if (idx !== -1) webhooks.splice(idx, 1);
}

/**
 * Deliver an event to all registered webhooks (with retry).
 * @param event - The event name
 * @param payload - The event payload
 * @param maxRetries - Maximum number of delivery attempts (default 3)
 */
export async function deliverEvent(event: string, payload: any, maxRetries = 3): Promise<void> {
  const targets = webhooks.filter((w) => w.events.includes(event));
  for (const webhook of targets) {
    let attempt = 0;
    let delivered = false;
    while (attempt < maxRetries && !delivered) {
      try {
        await fetch(webhook.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event, payload }),
        });
        delivered = true;
      } catch {
        attempt++;
        if (attempt >= maxRetries) {
          // Optionally log or store failed delivery
        }
      }
    }
  }
} 