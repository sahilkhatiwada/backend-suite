import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import {
  uploadLocalFile,
  getFileMetadata,
  validateFile,
  LocalUploadOptions,
  FileValidationOptions,
} from '../src';

const tmpDir = path.join(__dirname, 'tmp');
const srcFile = path.join(tmpDir, 'test.txt');

beforeEach(async () => {
  await fs.ensureDir(tmpDir);
  await fs.writeFile(srcFile, 'hello world');
});

afterEach(async () => {
  await fs.remove(tmpDir);
});

describe('@backend-suite/file-handler', () => {
  it('should upload a file locally', async () => {
    const destDir = path.join(tmpDir, 'dest');
    const destPath = await uploadLocalFile({ srcPath: srcFile, destDir });
    expect(await fs.pathExists(destPath)).toBe(true);
    expect(await fs.readFile(destPath, 'utf8')).toBe('hello world');
  });

  it('should extract file metadata', async () => {
    const meta = await getFileMetadata(srcFile);
    expect(meta.name).toBe('test.txt');
    expect(meta.size).toBe(11);
    expect(meta.mimeType).toBe('text/plain');
  });

  it('should validate file by mime type and size', async () => {
    const valid: FileValidationOptions = { allowedMimeTypes: ['text/plain'], maxSizeBytes: 20 };
    const invalidType: FileValidationOptions = { allowedMimeTypes: ['image/png'] };
    const invalidSize: FileValidationOptions = { maxSizeBytes: 5 };
    expect(await validateFile(srcFile, valid)).toBe(true);
    expect(await validateFile(srcFile, invalidType)).toBe(false);
    expect(await validateFile(srcFile, invalidSize)).toBe(false);
  });
}); 