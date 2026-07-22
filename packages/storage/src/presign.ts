import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2, R2_BUCKET } from "./client";

const UPLOAD_TTL = 60 * 5; // 5 minutes
const DOWNLOAD_TTL = 60 * 10; // 10 minutes

/** Presigned PUT URL for a direct browser → R2 upload. */
export function getUploadUrl(key: string, contentType: string): Promise<string> {
  const cmd = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(r2, cmd, { expiresIn: UPLOAD_TTL });
}

/** Presigned GET URL to view/download a private object. */
export function getDownloadUrl(key: string): Promise<string> {
  const cmd = new GetObjectCommand({ Bucket: R2_BUCKET, Key: key });
  return getSignedUrl(r2, cmd, { expiresIn: DOWNLOAD_TTL });
}

/** Public URL when the bucket/domain is public (R2_PUBLIC_URL set). */
export function getPublicUrl(key: string): string | null {
  const base = process.env.R2_PUBLIC_URL;
  return base ? `${base.replace(/\/$/, "")}/${key}` : null;
}

export async function deleteObject(key: string): Promise<void> {
  await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));
}
