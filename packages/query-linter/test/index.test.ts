import { describe, it, expect } from 'vitest';
import { lintQuery, beautifyQuery } from '../src';

function hasSqlfluff() {
  try {
    require('child_process').execSync('sqlfluff --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

describe('lintQuery', () => {
  (hasSqlfluff() ? it : it.skip)('should return lint errors for bad SQL', async () => {
    const sql = 'SELECT * FROM table where id = 1'; // lowercase where is a lint error in most dialects
    const errors = await lintQuery(sql, 'sql', { sqlDialect: 'ansi' });
    expect(Array.isArray(errors)).toBe(true);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors).not.toContain('No lint errors');
  });

  (hasSqlfluff() ? it : it.skip)('should return no errors for good SQL', async () => {
    const sql = 'SELECT * FROM table WHERE id = 1;';
    const errors = await lintQuery(sql, 'sql', { sqlDialect: 'ansi' });
    expect(errors).toContain('No lint errors');
  });

  it('should return no errors for valid JSON', async () => {
    const json = '{ "foo": 123 }';
    const errors = await lintQuery(json, 'json');
    expect(errors).toContain('No lint errors');
  });

  it('should return errors for invalid JSON', async () => {
    const json = '{ foo: 123 }';
    const errors = await lintQuery(json, 'json');
    expect(errors.length).toBeGreaterThan(0);
    expect(errors).not.toContain('No lint errors');
  });

  it('should return no errors for valid MongoDB', async () => {
    const mongo = '{ find: "users", filter: { age: { $gt: 18 } } }';
    const errors = await lintQuery(mongo, 'mongodb');
    expect(errors).toContain('No lint errors');
  });

  it('should return errors for invalid MongoDB', async () => {
    const mongo = '{ find: "users", filter: { age: { $gt: 18 } '; // missing closing braces
    const errors = await lintQuery(mongo, 'mongodb');
    expect(errors.length).toBeGreaterThan(0);
    expect(errors).not.toContain('No lint errors');
  });
});

describe('beautifyQuery', () => {
  it('should beautify SQL', () => {
    const ugly = 'select * from users where id=1';
    const pretty = beautifyQuery(ugly, 'sql');
    expect(pretty).toMatch(/SELECT \*/i);
    expect(pretty).toMatch(/FROM users/i);
  });

  it('should beautify JSON', () => {
    const ugly = '{"foo":123,"bar":[1,2,3]}';
    const pretty = beautifyQuery(ugly, 'json');
    expect(pretty).toMatch(/\n/);
    expect(pretty).toMatch(/  "/);
  });

  it('should beautify MongoDB', () => {
    const ugly = '{ find: "users", filter: { age: { $gt: 18 } } }';
    const pretty = beautifyQuery(ugly, 'mongodb');
    expect(pretty).toMatch(/\n/);
    expect(pretty).toMatch(/find/);
  });
}); 