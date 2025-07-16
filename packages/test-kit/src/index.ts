/**
 * @packageDocumentation
 * @module @backend-suite/test-kit
 *
 * Backend testing utilities: mock req/res, seed DBs, snapshot testing.
 */

/**
 * Mocks a request object for Express/Fastify/Koa.
 */
export function mockRequest(config: Record<string, any> = {}): any {
  // Basic mock for req object
  return {
    ...config,
    mocked: true,
    headers: config.headers || {},
    body: config.body || {},
    query: config.query || {},
    params: config.params || {},
    get: (header: string) => (config.headers ? config.headers[header] : undefined),
  };
}

/**
 * Mocks a response object for Express/Fastify/Koa.
 */
export function mockResponse(): any {
  const res: any = {
    mocked: true,
    statusCode: 200,
    headers: {},
    body: undefined,
    status(code: number) { res.statusCode = code; return res; },
    set(header: string, value: string) { res.headers[header] = value; return res; },
    json(payload: any) { res.body = payload; return res; },
    send(payload: any) { res.body = payload; return res; },
    end() { return res; },
  };
  return res;
}

/**
 * Seeds a database (in-memory mock for testing).
 */
let __mockDb: Record<string, any> = {};
export function seedDatabase(data: Record<string, any>): void {
  __mockDb = JSON.parse(JSON.stringify(data)); // Deep clone for isolation
  // Optionally expose for test inspection
  (global as any).__mockDb = __mockDb;
} 