import { describe, it, expect } from 'vitest';
import { encryptEnvFile, decryptEnvFile } from '../src';

describe('env-crypto', () => {
  it('should have encryptEnvFile and decryptEnvFile functions', () => {
    expect(typeof encryptEnvFile).toBe('function');
    expect(typeof decryptEnvFile).toBe('function');
  });
}); 