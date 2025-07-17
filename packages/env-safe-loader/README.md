# env-safe-loader

A smart, type-safe environment variable loader for Node.js and frontend apps.

## Features
- Schema-based validation (powered by Zod)
- Multi-environment .env file support
- Warns/errors on missing or extra variables
- Auto-generates .env.example
- Sensitive value masking in logs
- TypeScript auto-typing
- Prevents deployment with incomplete config

## Usage

```ts
import { z } from 'zod';
import { loadEnv } from 'env-safe-loader';

const env = loadEnv({
  schema: z.object({
    DB_HOST: z.string(),
    DB_PORT: z.string().default('5432'),
    API_KEY: z.string(),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  }),
  envFile: '.env',
  exampleFile: '.env.example',
  onError: 'throw',
});

console.log(env.DB_HOST); // type-safe access
``` 