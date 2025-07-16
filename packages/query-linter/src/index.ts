import { execSync } from 'child_process';
import { format as formatSQL } from 'sql-formatter';
import { parse as parseMongo } from 'mongodb-query-parser';

export type QueryType = 'sql' | 'mongodb' | 'json';

function ensureHomeEnv() {
  // On Windows, sqlfluff may fail if HOME is not set
  if (process.platform === 'win32' && !process.env.HOME && process.env.USERPROFILE) {
    process.env.HOME = process.env.USERPROFILE;
  }
}

function lintSQLWithSqlfluff(sql: string, dialect: string = 'ansi'): { line: number, code: string, description: string }[] {
  ensureHomeEnv();
  try {
    execSync('sqlfluff --version', { stdio: 'ignore' });
  } catch {
    throw new Error('sqlfluff is not installed. Please install it with: pip install sqlfluff');
  }
  const fs = require('fs');
  const os = require('os');
  const path = require('path');
  const tmpFile = path.join(os.tmpdir(), `query-linter-${Date.now()}.sql`);
  fs.writeFileSync(tmpFile, sql);
  try {
    const result = execSync(`sqlfluff lint --format json --dialect ${dialect} ${tmpFile}`, { encoding: 'utf8' });
    const parsed = JSON.parse(result);
    const violations = parsed[0]?.violations || [];
    return violations.map((v: any) => ({
      line: v.line_no,
      code: v.code,
      description: v.description,
    }));
  } finally {
    fs.unlinkSync(tmpFile);
  }
}

export async function lintQuery(query: string, type: QueryType = 'sql', options?: { sqlDialect?: string }): Promise<string[]> {
  try {
    if (type === 'sql') {
      const dialect = options?.sqlDialect || 'ansi';
      const violations = lintSQLWithSqlfluff(query, dialect);
      if (violations.length > 0) {
        return violations.map(v => `${v.line}:${v.code} ${v.description}`);
      }
      return ['No lint errors'];
    }
    if (type === 'mongodb') {
      try {
        parseMongo(query);
        return ['No lint errors'];
      } catch (e: any) {
        return [e.message || String(e)];
      }
    }
    if (type === 'json') {
      try {
        JSON.parse(query);
        return ['No lint errors'];
      } catch (e: any) {
        return [e.message || String(e)];
      }
    }
    return ['Unknown query type'];
  } catch (e: any) {
    return [
      'Linting failed: ' + (e.message || String(e))
    ];
  }
}

export function beautifyQuery(query: string, type: QueryType = 'sql'): string {
  if (type === 'sql') {
    return formatSQL(query);
  }
  if (type === 'mongodb') {
    try {
      const parsed = parseMongo(query);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return query;
    }
  }
  if (type === 'json') {
    try {
      const parsed = JSON.parse(query);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return query;
    }
  }
  return query;
} 