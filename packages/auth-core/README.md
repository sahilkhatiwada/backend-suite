# @backend-suite/auth-core

Core authentication utilities for Node.js/TypeScript monorepos. Provides in-memory user store, registration, authentication, password hashing, JWT/refresh token management, and user extraction utilities.

## Features
- In-memory user store (for demo/testing)
- User registration and authentication
- Password hashing and verification (bcrypt)
- JWT and refresh token generation/verification
- TypeScript types and JSDoc

## Installation

```sh
pnpm add @backend-suite/auth-core
```

## Usage

```ts
import { registerUser, authenticateUser, hashPassword, verifyPassword, generateJWT, verifyJWT } from '@backend-suite/auth-core';

// Register a user
const user = registerUser('alice', 'password123', { email: 'alice@example.com' });

// Authenticate
const result = authenticateUser('alice', 'password123');
if (result) {
  console.log('Access token:', result.accessToken);
}

// Hash/verify password
const hash = hashPassword('secret');
const valid = verifyPassword('secret', hash);

// JWT
const token = generateJWT(user, 'mysecret');
const payload = verifyJWT(token, 'mysecret');
```

## API

See full JSDoc in source. Main exports:
- `registerUser(username, password, extra?)`
- `authenticateUser(username, password)`
- `hashPassword(password)`
- `verifyPassword(password, hash)`
- `generateJWT(user, secret, expiresIn?)`
- `verifyJWT(token, secret)`
- `generateRefreshToken(user, secret, expiresIn?)`
- `verifyRefreshToken(token, secret)`

## Monorepo Usage
This package is part of the `backend-suite` monorepo. Use with other packages for full-stack backend development.

## Versioning & Releases
Managed with [Changesets](https://github.com/changesets/changesets). See root README for release workflow.

## License
MIT 