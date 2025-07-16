import { describe, it, expect } from 'vitest';
import { scanApi } from '../src';

describe('@backend-suite/api-security', () => {
  it('should scan an API endpoint (no issues)', () => {
    const report = scanApi({ endpoint: '/users', method: 'POST', payload: 'hello', headers: { 'x-content-type-options': 'nosniff', 'content-security-policy': "default-src 'self'" } });
    expect(report.issues.length).toBe(0);
  });

  it('should detect SQL injection', () => {
    const report = scanApi({ endpoint: '/users', method: 'POST', payload: "' OR 1=1; --" });
    expect(report.issues.some(i => i.type === 'SQL Injection')).toBe(true);
  });

  it('should detect XSS', () => {
    const report = scanApi({ endpoint: '/users', method: 'POST', payload: '<script>alert(1)</script>' });
    expect(report.issues.some(i => i.type === 'XSS')).toBe(true);
  });

  it('should detect missing security headers', () => {
    const report = scanApi({ endpoint: '/users', method: 'GET', headers: {} });
    expect(report.issues.some(i => i.type === 'Insecure Headers')).toBe(true);
  });

  it('should detect sensitive endpoints', () => {
    const report = scanApi({ endpoint: '/admin', method: 'GET' });
    expect(report.issues.some(i => i.type === 'Sensitive Endpoint')).toBe(true);
  });
}); 