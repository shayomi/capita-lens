import { S3Client } from "@aws-sdk/client-s3";

/** Cloudflare R2 is S3-compatible; point the SDK at the R2 endpoint. */
function createR2Client() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 credentials are not fully configured");
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

const globalForR2 = globalThis as unknown as { r2?: S3Client };

export const r2 = globalForR2.r2 ?? createR2Client();
if (process.env.NODE_ENV !== "production") globalForR2.r2 = r2;

export const R2_BUCKET = process.env.R2_BUCKET ?? "sadora-lens";
