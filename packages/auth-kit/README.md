# @backend-suite/auth-kit

Modular authentication toolkit: JWT, OAuth2, RBAC, scopes.

## Purpose
Provide a flexible and secure authentication toolkit for modern backend applications.

## Features
- JWT and OAuth2 support
- Role-based access control (RBAC)
- Scopes and permissions
- Middleware for Express, Fastify, Koa, etc.

## Usage
```ts
import { createAuth, verifyToken } from '@backend-suite/auth-kit';

const auth = createAuth({ strategy: 'jwt', secret: '...' });
const user = verifyToken('token');
```

## License
MIT 