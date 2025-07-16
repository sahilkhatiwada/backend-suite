/**
 * @packageDocumentation
 * @module @backend-suite/json-schema-tools
 *
 * Convert TypeScript to JSON Schema and vice versa for docs and validation.
 */

import path from 'path';
import { resolve } from 'path';
import * as TJS from 'typescript-json-schema';
import { compile, Options as JSTOptions } from 'json-schema-to-typescript';

/**
 * Converts a TypeScript type to JSON Schema.
 * @param typeName The name of the type/interface to convert
 * @param filePath The path to the TypeScript file containing the type
 * @param options Additional options for typescript-json-schema
 */
export function tsToJsonSchema(
  typeName: string,
  filePath: string,
  options?: {
    required?: boolean;
    ignoreErrors?: boolean;
    [key: string]: any;
  }
): object {
  try {
    const program = TJS.getProgramFromFiles([filePath], options?.compilerOptions || {});
    const schema = TJS.generateSchema(program, typeName, options);
    if (!schema) throw new Error('Schema generation failed');
    return schema;
  } catch (err) {
    if (options?.ignoreErrors) return {};
    throw err;
  }
}

/**
 * Converts a JSON Schema to TypeScript type.
 * @param schema The JSON Schema object
 * @param typeName The name for the generated TypeScript type
 * @param options Additional options for json-schema-to-typescript
 */
export async function jsonSchemaToTs(
  schema: object,
  typeName = 'GeneratedType',
  options?: Partial<JSTOptions>
): Promise<string> {
  return compile(schema as any, typeName, options);
} 