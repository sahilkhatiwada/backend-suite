import { describe, it, expect } from 'vitest';
import { mockRequest, mockResponse, seedDatabase } from '../src';

describe('@backend-suite/test-kit', () => {
  it('should mock a request (placeholder)', () => {
    expect(mockRequest({ method: 'GET' })).toHaveProperty('mocked', true);
  });

  it('should mock a response (placeholder)', () => {
    expect(mockResponse()).toHaveProperty('mocked', true);
  });

  it('should seed a database (placeholder)', () => {
    expect(() => seedDatabase({ users: [] })).not.toThrow();
  });
}); 