// TODO:
// - Implement structured logger using Pino (default) and Winston (optional)
// - Support named logger instances
// - Add JSON, pretty, and file transports
// - Prepare for APM/Sentry integration
// - Add tests for logger outputs
// - Add usage examples

import pino, { Logger, LoggerOptions, DestinationStream } from 'pino';
import type { StreamEntry } from 'pino';

const loggers = new Map<string, Logger>();

/**
 * Options for creating a logger instance.
 */
export interface CreateLoggerOptions extends LoggerOptions {
  /** Enable pretty output (requires pino-pretty) */
  pretty?: boolean;
  /** Log to file (provide file path) */
  file?: string;
}

/**
 * Create a named logger instance. Returns the same instance for the same name.
 *
 * @param name - Logger name (namespace)
 * @param options - Logger options (level, pretty, file, etc.)
 * @returns Pino logger instance
 */
export function createLogger(name: string, options: CreateLoggerOptions = {}): Logger {
  if (loggers.has(name)) return loggers.get(name)!;

  let destination: DestinationStream | undefined;
  if (options.file) {
    destination = pino.destination({ dest: options.file, sync: false });
  } else if (options.pretty) {
    // Use pino-pretty if pretty option is set
    try {
      // Dynamically require pino-pretty to avoid dependency if not needed
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const pretty = require('pino-pretty');
      destination = pretty();
    } catch {
      // fallback to default
    }
  }

  const logger = pino({ ...options, name }, destination);
  loggers.set(name, logger);
  return logger;
}

/**
 * Get a logger by name.
 *
 * @param name - Logger name
 * @returns Logger instance or undefined if not created
 */
export function getLogger(name: string): Logger | undefined {
  return loggers.get(name);
} 