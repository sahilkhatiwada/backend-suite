// src/index.ts
var AbuseDetector = class {
  constructor(options) {
    this.rules = options.rules;
    this.storage = options.storage;
  }
  async check(context) {
    for (const rule of this.rules) {
      if (await rule.check(context)) {
        await rule.action(context);
        return true;
      }
    }
    return false;
  }
};
function abuseMiddleware(detector) {
  return async (req, res, next) => {
    const context = {
      ip: req.ip,
      userId: req.user?.id,
      userAgent: req.headers["user-agent"],
      ...req.abuseContext
    };
    const abused = await detector.check(context);
    if (abused) {
      res.status(429).send("Too Many Requests or Abuse Detected");
      return;
    }
    next();
  };
}
export {
  AbuseDetector,
  abuseMiddleware
};
