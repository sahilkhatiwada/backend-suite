interface AbuseRule {
    id: string;
    description?: string;
    check: (context: AbuseContext) => boolean | Promise<boolean>;
    action: (context: AbuseContext) => void | Promise<void>;
}
interface AbuseContext {
    ip?: string;
    userId?: string;
    fingerprint?: string;
    userAgent?: string;
    [key: string]: any;
}
interface AbuseDetectorOptions {
    rules: AbuseRule[];
    storage?: AbuseStorage;
}
interface AbuseStorage {
    get(key: string): Promise<any>;
    set(key: string, value: any, ttl?: number): Promise<void>;
    incr?(key: string): Promise<number>;
}
declare class AbuseDetector {
    private rules;
    private storage?;
    constructor(options: AbuseDetectorOptions);
    check(context: AbuseContext): Promise<boolean>;
}
declare function abuseMiddleware(detector: AbuseDetector): (req: any, res: any, next: any) => Promise<void>;

export { type AbuseContext, AbuseDetector, type AbuseDetectorOptions, type AbuseRule, type AbuseStorage, abuseMiddleware };
