"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AbuseDetector: () => AbuseDetector,
  abuseMiddleware: () => abuseMiddleware
});
module.exports = __toCommonJS(index_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AbuseDetector,
  abuseMiddleware
});
