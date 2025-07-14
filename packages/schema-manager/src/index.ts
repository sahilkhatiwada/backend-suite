/**
 * A generic schema type (object with string keys and any values).
 */
export type Schema = Record<string, any>;

/**
 * The result of a schema diff operation.
 * - added: keys present in target but not in source
 * - removed: keys present in source but not in target
 * - changed: keys present in both but with different values
 */
export type SchemaDiff = { added: string[]; removed: string[]; changed: string[] };

/**
 * Diff two schemas and return added, removed, and changed keys.
 * @param source - The source schema
 * @param target - The target schema
 * @returns The diff result (added, removed, changed)
 */
export function diffSchemas(source: Schema, target: Schema): SchemaDiff {
  const added = Object.keys(target).filter((k) => !(k in source));
  const removed = Object.keys(source).filter((k) => !(k in target));
  const changed = Object.keys(target).filter(
    (k) => k in source && JSON.stringify(source[k]) !== JSON.stringify(target[k])
  );
  return { added, removed, changed };
}

/**
 * Sync target schema to match source schema (shallow merge).
 * @param source - The source schema
 * @param target - The target schema
 * @returns The synced schema
 */
export function syncSchemas(source: Schema, target: Schema): Schema {
  const diff = diffSchemas(source, target);
  const synced = { ...target };
  for (const k of diff.added) synced[k] = source[k];
  for (const k of diff.changed) synced[k] = source[k];
  for (const k of diff.removed) delete synced[k];
  return synced;
}

/**
 * Generate a migration script (as a string) from current to next schema.
 * @param current - The current schema
 * @param next - The next schema
 * @returns The migration script as a string
 */
export function generateMigration(current: Schema, next: Schema): string {
  const diff = diffSchemas(current, next);
  let script = '';
  for (const k of diff.added) script += `ADD COLUMN ${k};\n`;
  for (const k of diff.removed) script += `DROP COLUMN ${k};\n`;
  for (const k of diff.changed) script += `ALTER COLUMN ${k};\n`;
  return script;
} 