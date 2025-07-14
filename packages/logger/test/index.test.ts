import { describe, it, expect } from 'vitest';
import { createLogger, getLogger } from '../src';

describe('logger', () => {
  it('should export createLogger and getLogger functions', () => {
    expect(typeof createLogger).toBe('function');
    expect(typeof getLogger).toBe('function');
  });
}); 