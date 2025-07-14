# @backend-suite/env-crypto

Encrypt and decrypt .env files using AES-256. Supports CLI and programmatic API.

## Features
- Encrypt `.env` files to `.env.enc`
- Decrypt `.env.enc` files
- AES-256 encryption
- CLI and programmatic usage

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
- `encryptEnvFile(inputPath, outputPath, password)`
- `decryptEnvFile(inputPath, outputPath, password)` 