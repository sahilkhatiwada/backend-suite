/**
 * @packageDocumentation
 * @module @backend-suite/request-validator
 *
 * API input validation powered by Zod/Yup for runtime validation.
 */

import { ZodSchema } from 'zod';
import * as yup from 'yup';

/**
 * Validates a request payload using Zod or Yup schema.
 * Returns true if valid, false otherwise.
 */
export function validateRequest(schema: any, data: unknown): boolean {
  // Zod
  if (schema && typeof schema.safeParse === 'function') {
    const result = schema.safeParse(data);
    return result.success;
  }
  // Yup
  if (schema && typeof schema.validateSync === 'function') {
    try {
      schema.validateSync(data);
      return true;
    } catch (e) {
      return false;
    }
  }
  // Unknown schema type
  throw new Error('Unsupported schema type: must be Zod or Yup');
} 