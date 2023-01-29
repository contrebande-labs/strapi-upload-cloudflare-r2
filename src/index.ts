import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand
} from "@aws-sdk/client-s3";

type StripeUploadFile = { stream: ReadableStream, buffer: any, path: string, hash: string, ext: string, mime: string, url: string };

export default {
  init() {

    const S3 = new S3Client({
      region: "auto",
      endpoint: `https://${ process.env.CLOUDFLARE_R2_ACCOUNT_ID }.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      },
    });

    const Bucket = process.env.CLOUDFLARE_R2_BUCKET;

    const publicRoot = process.env.CLOUDFLARE_R2_PUBLIC_ROOT;

    async function upload(file: StripeUploadFile, customParams: any = {}): Promise<void> {

      const path = file.path ? `${ file.path }/` : '';

      const Key = `${ path }${ file.hash }${ file.ext }`;

      const Body = file.stream || Buffer.from(file.buffer, 'binary');

      const ACL = 'public-read';

      const ContentType = file.mime;

      await S3.send( new PutObjectCommand({ ...customParams, Bucket, Key, Body, ACL, ContentType }) );

      file.url = `${ publicRoot }${ path }`;

    }

    async function deleteFile(file: StripeUploadFile, customParams: any = {}): Promise<void> {

      const path = file.path ? `${ file.path }/` : '';

      const Key = `${ path }${ file.hash }${ file.ext }`;

      await S3.send( new DeleteObjectCommand({ ...customParams, Bucket, Key }) );

    }

    return {
      uploadStream: upload,
      upload,
      delete: deleteFile
    };
  },
};