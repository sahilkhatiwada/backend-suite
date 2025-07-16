/**
 * @packageDocumentation
 * @module @backend-suite/dev-mirror
 *
 * Mock external APIs and simulate databases for development and testing.
 */

import express, { Express, Request, Response } from 'express';

/**
 * Creates a mock API server using Express.
 * @param config { routes: Array<{ method: string, path: string, response: any, status?: number }> }
 * @returns The Express app instance
 */
export function createApiMock(config: {
  port?: number;
  routes: Array<{
    method: string;
    path: string;
    response: any;
    status?: number;
  }>;
}): Express {
  const app = express();
  app.use(express.json());

  if (Array.isArray(config.routes)) {
    config.routes.forEach(route => {
      const method = route.method.toLowerCase();
      (app as any)[method](route.path, (req: Request, res: Response) => {
        res.status(route.status || 200).json(route.response);
      });
    });
  }

  const port = config.port || 3001;
  app.listen(port, () => {
    console.log(`API mock server running on port ${port}`);
  });
  return app;
}

/**
 * Simple in-memory DB mock with CRUD operations.
 */
class InMemoryDbMock {
  private store: Record<string, any> = {};

  create(key: string, value: any) {
    this.store[key] = value;
  }

  read(key: string) {
    return this.store[key];
  }

  update(key: string, value: any) {
    if (this.store[key] !== undefined) {
      this.store[key] = value;
      return true;
    }
    return false;
  }

  delete(key: string) {
    if (this.store[key] !== undefined) {
      delete this.store[key];
      return true;
    }
    return false;
  }

  clear() {
    this.store = {};
  }
}

const dbMockInstance = new InMemoryDbMock();

/**
 * Returns the in-memory DB mock instance.
 */
export function createDbMock(): InMemoryDbMock {
  return dbMockInstance;
}

export type { InMemoryDbMock }; 