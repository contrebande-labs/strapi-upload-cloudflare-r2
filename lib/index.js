"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const Bucket = process.env.CLOUDFLARE_R2_BUCKET;
const PublicRoot = process.env.CLOUDFLARE_R2_PUBLIC_ROOT;
module.exports = {
    init: () => {
        const S3 = new client_s3_1.S3Client({
            region: "auto",
            endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
            credentials: {
                accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
                secretAccessKey: process.env.CLOUDFLARE_R2_ACCESS_KEY_SECRET,
            },
        });
        async function uploadHandler(file) {
            const path = file.path ? `${file.path}/` : '';
            const Key = `${process.env.CLOUDFLARE_R2_KEY_PREFIX}/${path}${file.hash}${file.ext}`;
            const Body = file.stream || Buffer.from(file.buffer, 'binary');
            const ACL = 'public-read';
            const ContentType = file.mime;
            await S3.send(new client_s3_1.PutObjectCommand({ Bucket, Key, Body, ACL, ContentType }));
            file.url = `${PublicRoot}/${Key}`;
        }
        async function deleteHandler(file) {
            const path = file.path ? `${file.path}/` : '';
            const Key = `${process.env.CLOUDFLARE_R2_KEY_PREFIX}/${path}${file.hash}${file.ext}`;
            await S3.send(new client_s3_1.DeleteObjectCommand({ Bucket, Key }));
        }
        return {
            uploadStream: uploadHandler,
            upload: uploadHandler,
            delete: deleteHandler
        };
    }
};
