import { describe, it, expect } from 'vitest';
import { addJob, processQueue } from '../src';

describe('queue-worker', () => {
  it('processes jobs from a queue', async () => {
    const results: number[] = [];
    addJob('q', 1);
    addJob('q', 2);
    addJob('q', 3);
    await new Promise((resolve) => {
      processQueue('q', async (job) => {
        results.push(job);
        if (results.length === 3) resolve(null);
      });
    });
    expect(results.sort()).toEqual([1, 2, 3]);
  });

  it('retries failed jobs', async () => {
    let attempts = 0;
    addJob('q2', 42);
    await new Promise((resolve) => {
      processQueue('q2', async (job) => {
        attempts++;
        if (attempts < 2) throw new Error('fail');
        resolve(null);
      });
    });
    expect(attempts).toBe(2);
  });
}); 