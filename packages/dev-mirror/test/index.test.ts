import { describe, it, expect } from 'vitest';
import { createApiMock, createDbMock, InMemoryDbMock } from '../src';

import request from 'supertest';

describe('@backend-suite/dev-mirror', () => {
  it('should create an API mock and respond to requests', async () => {
    const app = createApiMock({
      port: 0, // Let the OS assign a free port for testing
      routes: [
        { method: 'GET', path: '/hello', response: { message: 'world' } },
        { method: 'POST', path: '/echo', response: { ok: true }, status: 201 },
      ],
    });
    // Use supertest to test the express app
    await request(app)
      .get('/hello')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({ message: 'world' });
    await request(app)
      .post('/echo')
      .send({ foo: 'bar' })
      .expect(201)
      .expect({ ok: true });
  });

  it('should create a DB mock and perform CRUD operations', () => {
    const db: InMemoryDbMock = createDbMock();
    db.clear();
    db.create('foo', { bar: 1 });
    expect(db.read('foo')).toEqual({ bar: 1 });
    expect(db.update('foo', { bar: 2 })).toBe(true);
    expect(db.read('foo')).toEqual({ bar: 2 });
    expect(db.delete('foo')).toBe(true);
    expect(db.read('foo')).toBeUndefined();
    expect(db.update('not-exist', {})).toBe(false);
    expect(db.delete('not-exist')).toBe(false);
  });
}); 