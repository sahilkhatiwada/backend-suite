# @backend-suite/api-security

Scan for common API vulnerabilities and OWASP checks.

## Purpose
Automate security scanning for APIs to catch vulnerabilities early in development.

## Features
- Scan for OWASP Top 10 vulnerabilities
- Static and dynamic analysis
- Integrate with CI/CD pipelines
- Customizable rules and reports

## Usage
```ts
import { scanApi } from '@backend-suite/api-security';

const report = scanApi({ endpoint: '/users', method: 'POST', payload: {} });
```

## License
MIT 