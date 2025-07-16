# @backend-suite/json-schema-tools

Convert TypeScript to JSON Schema and vice versa for docs and validation.

## Purpose
Easily generate and consume JSON Schemas from TypeScript types for documentation and runtime validation.

## Features
- Convert TypeScript types to JSON Schema
- Convert JSON Schema to TypeScript types
- Useful for API docs, validation, and codegen
- CLI and programmatic usage

## Usage
```ts
import { tsToJsonSchema, jsonSchemaToTs } from '@backend-suite/json-schema-tools';

const schema = tsToJsonSchema('User', './types.ts');
const ts = jsonSchemaToTs(schema);
```

## License
MIT 