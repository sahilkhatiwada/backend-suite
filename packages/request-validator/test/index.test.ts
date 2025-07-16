import { describe, it, expect } from 'vitest';
import { validateRequest } from '../src';
import { z } from 'zod';
import * as yup from 'yup';

describe('@backend-suite/request-validator', () => {
  it('should validate a request with Zod schema', () => {
    const schema = z.object({ name: z.string(), age: z.number() });
    expect(validateRequest(schema, { name: 'Alice', age: 30 })).toBe(true);
    expect(validateRequest(schema, { name: 'Alice', age: 'not-a-number' })).toBe(false);
  });

  it('should validate a request with Yup schema', () => {
    const schema = yup.object({ name: yup.string().required(), age: yup.number().required() });
    expect(validateRequest(schema, { name: 'Bob', age: 25 })).toBe(true);
    expect(validateRequest(schema, { name: 'Bob', age: 'not-a-number' })).toBe(false);
  });
}); 