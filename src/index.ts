import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand
} from "@aws-sdk/client-s3";

type StripeUploadFile = { stream: ReadableStream, buffer: any, path: string, hash: string, ext: string, mime: string, url: string };

module.exports = {
  init() {

    const S3 = new S3Client({
      region: "auto",
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_R2_ACCESS_KEY_SECRET,
      },
    });

    const Bucket = process.env.CLOUDFLARE_R2_BUCKET;

    const publicRoot = process.env.CLOUDFLARE_R2_PUBLIC_ROOT;

    async function uploadHandler(file: StripeUploadFile): Promise<void> {

      const path = file.path ? `${ file.path }/` : '';

      const Key = `${ path }${ file.hash }${ file.ext }`;

      const Body = file.stream || Buffer.from(file.buffer, 'binary');

      const ACL = 'public-read';

      const ContentType = file.mime;

      await S3.send( new PutObjectCommand({ Bucket, Key, Body, ACL, ContentType }) );

      file.url = `${ publicRoot }${ Key }`;

    }

    async function deleteHandler(file: StripeUploadFile): Promise<void> {

      const path = file.path ? `${ file.path }/` : '';

      const Key = `${ path }${ file.hash }${ file.ext }`;

      await S3.send( new DeleteObjectCommand({ Bucket, Key }) );

    }

    return {
      uploadStream: uploadHandler,
      upload: uploadHandler,
      delete: deleteHandler
    };
  },
};