type StripeUploadFile = {
    stream: ReadableStream;
    buffer: any;
    path: string;
    hash: string;
    ext: string;
    mime: string;
    url: string;
};
declare const _default: {
    init(): {
        uploadStream: (file: StripeUploadFile, customParams?: any) => Promise<void>;
        upload: (file: StripeUploadFile, customParams?: any) => Promise<void>;
        delete: (file: StripeUploadFile, customParams?: any) => Promise<void>;
    };
};
export default _default;
