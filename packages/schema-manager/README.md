# @backend-suite/schema-manager

Schema management and syncing utilities for Node.js/TypeScript monorepos. Provides schema diffing, syncing, and migration script generation.

## Features
- Schema diff (added, removed, changed keys)
- Schema syncing (shallow merge)
- Migration script generation
- TypeScript types and JSDoc

## Installation

```sh
pnpm add @backend-suite/schema-manager
```

## Usage

```ts
import { diffSchemas, syncSchemas, generateMigration } from '@backend-suite/schema-manager';

const current = { id: 'number', name: 'string' };
const next = { id: 'number', name: 'string', email: 'string' };

const diff = diffSchemas(current, next);
// { added: ['email'], removed: [], changed: [] }

const synced = syncSchemas(current, next);
// { id: 'number', name: 'string', email: 'string' }

const migration = generateMigration(current, next);
// 'ADD COLUMN email;\n'
```

## API

See full JSDoc in source. Main exports:
- `diffSchemas(source, target)`
- `syncSchemas(source, target)`
- `generateMigration(current, next)`

## Monorepo Usage
This package is part of the `backend-suite` monorepo. Use with other packages for full-stack backend development.

## Versioning & Releases
Managed with [Changesets](https://github.com/changesets/changesets). See root README for release workflow.

## License
MIT 