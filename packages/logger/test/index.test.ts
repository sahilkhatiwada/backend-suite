import { describe, it, expect, vi } from 'vitest';
import { createLogger, getLogger } from '../src';
import * as os from 'os';
import * as path from 'path';

describe('logger', () => {
  it('should create and retrieve named logger', () => {
    const logger = createLogger('test', { level: 'info' });
    expect(logger).toBeDefined();
    expect(getLogger('test')).toBe(logger);
  });

  it('should return undefined for unknown logger', () => {
    expect(getLogger('not-exist')).toBeUndefined();
  });

  it('should support pretty and file options (mocked)', async () => {
    const pretty = vi.fn(() => ({}));
    const tmpFile = path.join(os.tmpdir(), `logger-test-${Date.now()}.log`);
    const destination = { dest: tmpFile, sync: false };
    const pino = vi.fn(() => ({ info: vi.fn() }));
    vi.doMock('pino', () => ({ default: pino, destination: vi.fn(() => destination) }));
    vi.doMock('pino-pretty', () => pretty);
    const { createLogger: createLoggerMock } = await import('../src');
    // Should not throw
    createLoggerMock('pretty', { pretty: true });
    createLoggerMock('file', { file: tmpFile });
    vi.resetAllMocks();
  });
}); 