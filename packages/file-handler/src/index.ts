import fs from 'fs-extra';
import path from 'path';
import AWS from 'aws-sdk';
import mime from 'mime-types';

export interface LocalUploadOptions {
  srcPath: string;
  destDir: string;
  destFileName?: string;
}

export async function uploadLocalFile(options: LocalUploadOptions): Promise<string> {
  const { srcPath, destDir, destFileName } = options;
  await fs.ensureDir(destDir);
  const fileName = destFileName || path.basename(srcPath);
  const destPath = path.join(destDir, fileName);
  await fs.copy(srcPath, destPath);
  return destPath;
}

export interface S3UploadOptions {
  filePath: string;
  bucket: string;
  key: string;
  s3Config: AWS.S3.ClientConfiguration;
}

export async function uploadToS3(options: S3UploadOptions): Promise<AWS.S3.ManagedUpload.SendData> {
  const { filePath, bucket, key, s3Config } = options;
  const s3 = new AWS.S3(s3Config);
  const fileContent = await fs.readFile(filePath);
  const contentType = mime.lookup(filePath) || 'application/octet-stream';
  return s3.upload({
    Bucket: bucket,
    Key: key,
    Body: fileContent,
    ContentType: contentType as string,
  }).promise();
}

export interface FileMetadata {
  size: number;
  mimeType: string | false;
  name: string;
}

export async function getFileMetadata(filePath: string): Promise<FileMetadata> {
  const stats = await fs.stat(filePath);
  return {
    size: stats.size,
    mimeType: mime.lookup(filePath),
    name: path.basename(filePath),
  };
}

export interface FileValidationOptions {
  allowedMimeTypes?: string[];
  maxSizeBytes?: number;
}

export async function validateFile(filePath: string, options: FileValidationOptions): Promise<boolean> {
  const { allowedMimeTypes, maxSizeBytes } = options;
  const metadata = await getFileMetadata(filePath);
  if (allowedMimeTypes && (!metadata.mimeType || !allowedMimeTypes.includes(metadata.mimeType as string))) {
    return false;
  }
  if (maxSizeBytes && metadata.size > maxSizeBytes) {
    return false;
  }
  return true;
} 