# Fastify Example App

This example demonstrates how to use multiple `@backend-suite/*` packages together in a real-world Fastify backend application.

## Features
- User registration and authentication (`auth-core`)
- Rate limiting middleware (`rate-limiter`)
- Structured logging (`logger`)

## Setup

```sh
pnpm install
pnpm dev
```

## Main Packages Used
- [@backend-suite/auth-core](../../packages/auth-core)
- [@backend-suite/rate-limiter](../../packages/rate-limiter)
- [@backend-suite/logger](../../packages/logger)

## Example Endpoints
- `POST /register` — Register a new user
- `POST /login` — Authenticate and receive a JWT
- `GET /protected` — Access a protected route with JWT

See `index.ts` for full source code. 