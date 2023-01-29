"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
exports.default = {
    init() {
        const S3 = new client_s3_1.S3Client({
            region: "auto",
            endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
                secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
            },
        });
        const Bucket = process.env.CLOUDFLARE_R2_BUCKET;
        const publicRoot = process.env.CLOUDFLARE_R2_PUBLIC_ROOT;
        async function upload(file, customParams = {}) {
            const path = file.path ? `${file.path}/` : '';
            const Key = `${path}${file.hash}${file.ext}`;
            const Body = file.stream || Buffer.from(file.buffer, 'binary');
            const ACL = 'public-read';
            const ContentType = file.mime;
            await S3.send(new client_s3_1.PutObjectCommand({ ...customParams, Bucket, Key, Body, ACL, ContentType }));
            file.url = `${publicRoot}${path}`;
        }
        async function deleteFile(file, customParams = {}) {
            const path = file.path ? `${file.path}/` : '';
            const Key = `${path}${file.hash}${file.ext}`;
            await S3.send(new client_s3_1.DeleteObjectCommand({ ...customParams, Bucket, Key }));
        }
        return {
            uploadStream: upload,
            upload,
            delete: deleteFile
        };
    },
};
