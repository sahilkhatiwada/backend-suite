// @backend-suite/abuse-detector
// Core types and AbuseDetector class

export interface AbuseRule {
  id: string;
  description?: string;
  check: (context: AbuseContext) => boolean | Promise<boolean>;
  action: (context: AbuseContext) => void | Promise<void>;
}

export interface AbuseContext {
  ip?: string;
  userId?: string;
  fingerprint?: string;
  userAgent?: string;
  [key: string]: any;
}

export interface AbuseDetectorOptions {
  rules: AbuseRule[];
  storage?: AbuseStorage;
}

export interface AbuseStorage {
  get(key: string): Promise<any>;
  set(key: string, value: any, ttl?: number): Promise<void>;
  incr?(key: string): Promise<number>;
}

export class AbuseDetector {
  private rules: AbuseRule[];
  private storage?: AbuseStorage;

  constructor(options: AbuseDetectorOptions) {
    this.rules = options.rules;
    this.storage = options.storage;
  }

  async check(context: AbuseContext): Promise<boolean> {
    for (const rule of this.rules) {
      if (await rule.check(context)) {
        await rule.action(context);
        return true;
      }
    }
    return false;
  }
}

// Express/Fastify/Koa middleware (starter)
export function abuseMiddleware(detector: AbuseDetector) {
  return async (req: any, res: any, next: any) => {
    const context: AbuseContext = {
      ip: req.ip,
      userId: req.user?.id,
      userAgent: req.headers['user-agent'],
      ...req.abuseContext
    };
    const abused = await detector.check(context);
    if (abused) {
      res.status(429).send('Too Many Requests or Abuse Detected');
      return;
    }
    next();
  };
} 