// TODO:
// - Implement AES-256 encryption for .env files
// - Implement AES-256 decryption for .env.enc files
// - Add CLI interface for encrypt/decrypt
// - Add programmatic API
// - Add tests for encryption/decryption
// - Add usage examples

import * as fs from 'fs';
import * as path from 'path';
import CryptoJS from 'crypto-js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

/**
 * Encrypts a .env file using AES-256.
 *
 * @param inputPath - Path to the input .env file
 * @param outputPath - Path to write the encrypted .env.enc file
 * @param password - Password for encryption
 */
export function encryptEnvFile(inputPath: string, outputPath: string, password: string): void {
  const absInput = path.resolve(inputPath);
  const absOutput = path.resolve(outputPath);
  const envContent = fs.readFileSync(absInput, 'utf8');
  const encrypted = CryptoJS.AES.encrypt(envContent, password).toString();
  fs.writeFileSync(absOutput, encrypted, 'utf8');
}

/**
 * Decrypts a .env.enc file using AES-256.
 *
 * @param inputPath - Path to the input .env.enc file
 * @param outputPath - Path to write the decrypted .env file
 * @param password - Password for decryption
 * @throws If decryption fails (wrong password or corrupted file)
 */
export function decryptEnvFile(inputPath: string, outputPath: string, password: string): void {
  const absInput = path.resolve(inputPath);
  const absOutput = path.resolve(outputPath);
  const encryptedContent = fs.readFileSync(absInput, 'utf8');
  const bytes = CryptoJS.AES.decrypt(encryptedContent, password);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  if (!decrypted) throw new Error('Decryption failed: wrong password or corrupted file');
  fs.writeFileSync(absOutput, decrypted, 'utf8');
}

// CLI handler
if (require.main === module) {
  yargs(hideBin(process.argv))
    .command(
      'encrypt',
      'Encrypt a .env file',
      (yargs) =>
        yargs
          .option('input', { type: 'string', demandOption: true, describe: 'Input .env file' })
          .option('output', { type: 'string', demandOption: true, describe: 'Output .env.enc file' })
          .option('password', { type: 'string', demandOption: true, describe: 'Encryption password' }),
      (argv) => {
        encryptEnvFile(argv.input as string, argv.output as string, argv.password as string);
        console.log('Encrypted successfully.');
      },
    )
    .command(
      'decrypt',
      'Decrypt a .env.enc file',
      (yargs) =>
        yargs
          .option('input', { type: 'string', demandOption: true, describe: 'Input .env.enc file' })
          .option('output', { type: 'string', demandOption: true, describe: 'Output .env file' })
          .option('password', { type: 'string', demandOption: true, describe: 'Decryption password' }),
      (argv) => {
        decryptEnvFile(argv.input as string, argv.output as string, argv.password as string);
        console.log('Decrypted successfully.');
      },
    )
    .demandCommand(1)
    .help()
    .parse();
} 