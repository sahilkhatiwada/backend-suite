import { z, ZodSchema, ZodTypeAny, ZodError } from 'zod';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

export type EnvSafeLoaderOptions<T extends ZodTypeAny> = {
  schema: T;
  envFile?: string; // base .env file (default: .env)
  envName?: string; // e.g., 'development', 'test', 'production' (default: NODE_ENV)
  exampleFile?: string;
  maskSensitive?: (key: string) => boolean;
  onError?: 'throw' | 'warn';
  warnOnExtra?: boolean;
};

function formatZodErrors(error: ZodError) {
  return error.errors
    .map(
      (e) =>
        `- ${e.path.join('.') || '(root)'}: ${e.message}`
    )
    .join('\n');
}

function loadEnvFiles(baseFile: string, envName?: string) {
  // Load base .env first
  dotenv.config({ path: baseFile });
  // Then load .env.{env} if present, merging (env-specific takes precedence)
  if (envName) {
    const envFile = baseFile.replace(/(\.env)(\..+)?$/, `.env.${envName}`);
    if (fs.existsSync(envFile)) {
      dotenv.config({ path: envFile, override: true });
    }
  }
}

/**
 * Loads and validates environment variables using a Zod schema.
 * Returns a type-safe object inferred from the schema.
 *
 * Example usage:
 *
 *   const env = loadEnv({
 *     schema: z.object({
 *       DB_HOST: z.string(),
 *       DB_PORT: z.string().default('5432'),
 *       API_KEY: z.string(),
 *     })
 *   });
 *   // env.DB_HOST is type-safe (string)
 */
export function loadEnv<T extends ZodTypeAny>(options: EnvSafeLoaderOptions<T>): z.infer<T> {
  // Multi-env file merging
  // Loads .env, then .env.{env} (e.g., .env.development), with env-specific values taking precedence
  const baseFile = options.envFile || path.resolve(process.cwd(), '.env');
  const envName = options.envName || process.env.NODE_ENV;
  loadEnvFiles(baseFile, envName);

  // Validate env
  const parsed = options.schema.safeParse(process.env);
  if (!parsed.success) {
    const message = `❌ Invalid environment variables:\n${formatZodErrors(parsed.error)}`;
    if (options.onError === 'warn') {
      console.warn(message);
    } else {
      throw new Error(message);
    }
  }

  // Warn on extra variables not in schema
  if (options.warnOnExtra && options.schema instanceof z.ZodObject) {
    const schemaKeys = Object.keys(options.schema.shape);
    const extra = Object.keys(process.env).filter(
      (k) => !schemaKeys.includes(k)
    );
    if (extra.length > 0) {
      console.warn(
        `⚠️  Extra environment variables detected (not in schema): ${extra.join(', ')}`
      );
    }
  }

  // Deployment safety: always throw in production if invalid
  const isProduction = (options.envName || process.env.NODE_ENV) === 'production';
  if (!parsed.success && isProduction) {
    throw new Error(
      `❌ Deployment blocked: Invalid or missing environment variables in production.\n${formatZodErrors(parsed.error)}`
    );
  }

  // TODO: Generate .env.example and mask sensitive values
  if (options.exampleFile && options.schema instanceof z.ZodObject) {
    const schemaKeys = Object.keys(options.schema.shape);
    const lines: string[] = [];
    const maskSensitive = options.maskSensitive || ((key: string) => /SECRET|PASSWORD|TOKEN|API_KEY/i.test(key));
    for (const key of schemaKeys) {
      let value = '';
      if (maskSensitive(key)) {
        value = '****';
      } else {
        value = process.env[key] || '';
      }
      lines.push(`${key}=${value}`);
    }
    try {
      fs.writeFileSync(options.exampleFile, lines.join('\n') + '\n');
    } catch (err) {
      console.warn(`Could not write .env.example: ${err}`);
    }
  }

  return parsed.success ? parsed.data : {} as z.infer<T>;
} 