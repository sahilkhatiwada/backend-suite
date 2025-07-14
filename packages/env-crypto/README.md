# @backend-suite/env-crypto

> Part of the [backend-suite](https://github.com/your-org/backend-suite) monorepo — a unified ecosystem of modular, production-ready backend utilities.

## Packages in the Suite
- [@backend-suite/env-crypto](../env-crypto)
- [@backend-suite/rate-limiter](../rate-limiter)
- [@backend-suite/logger](../logger)

## How to Use Multiple Packages
Install any package you need:
```sh
pnpm add @backend-suite/env-crypto @backend-suite/rate-limiter @backend-suite/logger
```

Import and use in your project:
```ts
import { encryptEnvFile } from '@backend-suite/env-crypto';
import { createTokenBucketLimiter } from '@backend-suite/rate-limiter';
import { createLogger } from '@backend-suite/logger';
```

## Versioning
This package is versioned independently using [Changesets](https://github.com/changesets/changesets). See the monorepo root for release and changelog management.

---

Encrypt and decrypt .env files using AES-256. Supports CLI and programmatic API.

## Features
- Encrypt `.env` files to `.env.enc`
- Decrypt `.env.enc` files
- AES-256 encryption
- CLI and programmatic usage

## Installation
```sh
pnpm add @backend-suite/env-crypto
```

## Usage

### CLI
```sh
npx @backend-suite/env-crypto encrypt --input .env --output .env.enc --password <password>
npx @backend-suite/env-crypto decrypt --input .env.enc --output .env --password <password>
```

### Programmatic
```ts
import { encryptEnvFile, decryptEnvFile } from '@backend-suite/env-crypto';

encryptEnvFile('.env', '.env.enc', 'password');
decryptEnvFile('.env.enc', '.env', 'password');
```

## API

### `encryptEnvFile(inputPath: string, outputPath: string, password: string): void`
Encrypts a .env file using AES-256 and writes the result to outputPath.

### `decryptEnvFile(inputPath: string, outputPath: string, password: string): void`
Decrypts a .env.enc file using AES-256 and writes the result to outputPath.

## License
MIT 