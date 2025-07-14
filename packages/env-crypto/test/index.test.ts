import { describe, it, expect } from 'vitest';
import { encryptEnvFile, decryptEnvFile } from '../src';
import * as fs from 'fs';
import * as path from 'path';

describe('env-crypto', () => {
  const tempDir = path.join(__dirname, 'tmp');
  const envFile = path.join(tempDir, '.env');
  const encFile = path.join(tempDir, '.env.enc');
  const decFile = path.join(tempDir, '.env.decrypted');
  const password = 'test-password';

  it('should encrypt and decrypt .env file correctly', () => {
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    fs.writeFileSync(envFile, 'SECRET=123\nFOO=bar');
    encryptEnvFile(envFile, encFile, password);
    expect(fs.existsSync(encFile)).toBe(true);
    decryptEnvFile(encFile, decFile, password);
    expect(fs.readFileSync(decFile, 'utf8')).toBe('SECRET=123\nFOO=bar');
    [envFile, encFile, decFile].forEach((f) => {
      if (fs.existsSync(f)) fs.unlinkSync(f);
    });
    if (fs.existsSync(tempDir)) fs.rmdirSync(tempDir);
  });

  it('should throw on wrong password', () => {
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    fs.writeFileSync(envFile, 'SECRET=123\nFOO=bar');
    encryptEnvFile(envFile, encFile, password);
    expect(() => decryptEnvFile(encFile, decFile, 'wrong')).toThrow();
    [envFile, encFile, decFile].forEach((f) => {
      if (fs.existsSync(f)) fs.unlinkSync(f);
    });
    if (fs.existsSync(tempDir)) fs.rmdirSync(tempDir);
  });
}); 