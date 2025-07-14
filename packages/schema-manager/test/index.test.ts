import { describe, it, expect } from 'vitest';
import { diffSchemas, syncSchemas, generateMigration } from '../src';

describe('schema-manager', () => {
  const schemaA = { id: 'int', name: 'string', age: 'int' };
  const schemaB = { id: 'int', name: 'string', email: 'string' };

  it('diffs schemas correctly', () => {
    const diff = diffSchemas(schemaA, schemaB);
    expect(diff.added).toEqual(['email']);
    expect(diff.removed).toEqual(['age']);
    expect(diff.changed).toEqual([]);
  });

  it('syncs schemas', () => {
    const synced = syncSchemas(schemaA, schemaB);
    expect(synced).toEqual({ id: 'int', name: 'string', email: 'string' });
  });

  it('generates migration script', () => {
    const script = generateMigration(schemaA, schemaB);
    expect(script).toContain('ADD COLUMN email;');
    expect(script).toContain('DROP COLUMN age;');
  });
}); 