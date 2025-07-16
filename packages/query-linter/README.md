# Query Linter

A unified linter and beautifier for SQL, MongoDB, and JSON queries.

## Features
- **SQL linting:** Uses [sqlfluff](https://docs.sqlfluff.com/) for robust, production-ready SQL linting (supports multiple dialects).
- **MongoDB linting:** Uses `mongodb-query-parser` for syntax validation.
- **JSON linting:** Uses `JSON.parse` for syntax validation.
- **Beautification:** SQL (via `sql-formatter`), MongoDB, and JSON.

## Requirements

### SQL Linting
- **sqlfluff** (Python) must be installed and available in your PATH.
- Install with:
  ```sh
  pip install sqlfluff
  ```
- The linter will throw an error if `sqlfluff` is not installed.
- You can specify the SQL dialect (default: `ansi`).
- On Windows, the package will set the `HOME` environment variable if missing to avoid sqlfluff config errors.

## Usage

```ts
import { lintQuery, beautifyQuery } from '@backend-suite/query-linter';

// SQL
const sql = 'SELECT * FROM table WHERE id = 1';
const errors = await lintQuery(sql, 'sql', { sqlDialect: 'postgres' });
console.log(errors); // Array of linting issues or ['No lint errors']
console.log(beautifyQuery(sql, 'sql'));

// MongoDB
const mongo = '{ find: "users", filter: { age: { $gt: 18 } } }';
const errorsMongo = await lintQuery(mongo, 'mongodb');
console.log(errorsMongo);
console.log(beautifyQuery(mongo, 'mongodb'));

// JSON
const json = '{ "foo": 123 }';
const errorsJson = await lintQuery(json, 'json');
console.log(errorsJson);
console.log(beautifyQuery(json, 'json'));
```

## Notes
- For SQL linting, the package invokes `sqlfluff` via CLI and parses its output.
- If `sqlfluff` is not installed, an error will be thrown.
- For MongoDB and JSON, only syntax validation is performed.
- On Windows, if you see a `FileNotFoundError` from sqlfluff, ensure your user profile directory exists and is accessible.

## License
MIT 