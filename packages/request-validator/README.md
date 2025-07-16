# @backend-suite/request-validator

API input validation powered by Zod/Yup for runtime validation.

## Purpose
Ensure robust and secure API input validation at runtime using popular schema libraries.

## Features
- Validate request bodies, params, and queries
- Zod and Yup support
- Custom error formatting
- Easy integration with Express, Fastify, Koa, etc.

## Usage
```ts
import { validateRequest } from '@backend-suite/request-validator';

const schema = {/* ... */};
const result = validateRequest(schema, req.body);
```

## License
MIT 