type StripeUploadFile = {
    stream: ReadableStream;
    buffer: any;
    path: string;
    hash: string;
    ext: string;
    mime: string;
    url: string;
};
declare const provider: {
    init: () => {
        uploadStream: (file: StripeUploadFile) => Promise<void>;
        upload: (file: StripeUploadFile) => Promise<void>;
        delete: (file: StripeUploadFile) => Promise<void>;
    };
};
export default provider;
