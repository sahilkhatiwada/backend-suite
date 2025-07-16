/**
 * @packageDocumentation
 * @module @backend-suite/api-security
 *
 * Scan for common API vulnerabilities and OWASP checks.
 */

export interface ScanConfig {
  endpoint: string;
  method: string;
  payload?: unknown;
  headers?: Record<string, string>;
}

export interface ScanIssue {
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export interface ScanReport {
  endpoint: string;
  method: string;
  issues: ScanIssue[];
}

/**
 * Scans an API endpoint for vulnerabilities (basic static checks).
 */
export function scanApi(config: ScanConfig): ScanReport {
  const issues: ScanIssue[] = [];

  // Check for SQL injection patterns in payload (very basic)
  if (typeof config.payload === 'string' && /('|--|;|\b(OR|AND)\b)/i.test(config.payload)) {
    issues.push({
      type: 'SQL Injection',
      message: 'Possible SQL injection pattern detected in payload.',
      severity: 'high',
    });
  }

  // Check for XSS patterns in payload (very basic)
  if (typeof config.payload === 'string' && /<script.*?>.*?<\/script>/i.test(config.payload)) {
    issues.push({
      type: 'XSS',
      message: 'Possible XSS pattern detected in payload.',
      severity: 'high',
    });
  }

  // Check for insecure headers
  if (config.headers) {
    if (!('x-content-type-options' in config.headers)) {
      issues.push({
        type: 'Insecure Headers',
        message: 'Missing X-Content-Type-Options header.',
        severity: 'medium',
      });
    }
    if (!('content-security-policy' in config.headers)) {
      issues.push({
        type: 'Insecure Headers',
        message: 'Missing Content-Security-Policy header.',
        severity: 'medium',
      });
    }
  }

  // Check for sensitive endpoints
  if (/\/admin|\/debug|\/internal/i.test(config.endpoint)) {
    issues.push({
      type: 'Sensitive Endpoint',
      message: 'Endpoint may expose sensitive functionality.',
      severity: 'high',
    });
  }

  return {
    endpoint: config.endpoint,
    method: config.method,
    issues,
  };
} 