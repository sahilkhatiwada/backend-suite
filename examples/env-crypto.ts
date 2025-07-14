import { encryptEnvFile, decryptEnvFile } from '@backend-suite/env-crypto';

encryptEnvFile('.env', '.env.enc', 'password');
decryptEnvFile('.env.enc', '.env', 'password'); 