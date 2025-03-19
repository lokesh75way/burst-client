import { Credentials, S3 } from "aws-sdk";

import {
    AWS_ACCESS_KEY_ID,
    AWS_S3_BUCKET,
    AWS_S3_REGION,
    AWS_SECRET_ACCESS_KEY,
} from "../config/constants";

const credentials = new Credentials({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_S3_REGION,
});

export const uploadImageToS3 = async (image) => {
    try {
        const s3 = new S3({ credentials });
        const imagePath = image.uri;

        let picture = await fetch(imagePath);
        picture = await picture.blob();
        const imageUuid = picture._data.name;
        const fileKey = `image-uploads/${imageUuid}`;
        const fileSize = picture.size;
        const partSize = 5 * 1024 * 1024; // 5 MB
        const uploadData = await s3
            .createMultipartUpload({
                Bucket: AWS_S3_BUCKET,
                Key: fileKey,
            })
            .promise();

        const UploadId = uploadData.UploadId;
        const uploadPromises = [];
        for (let start = 0; start < fileSize; start += partSize) {
            const end = Math.min(start + partSize, fileSize);
            const partNumber = Math.floor(start / partSize) + 1;
            const fileChunk = picture.slice(start, end);

            const partPromise = s3
                .uploadPart({
                    Bucket: AWS_S3_BUCKET,
                    Key: fileKey,
                    UploadId,
                    PartNumber: partNumber,
                    Body: fileChunk,
                })
                .promise();
            uploadPromises.push(partPromise);
        }
        await Promise.all(uploadPromises);

        const uploadParts = uploadPromises.map((promise, index) => ({
            PartNumber: index + 1,
            ETag: promise._j.ETag,
        }));

        s3.completeMultipartUpload({
            Bucket: AWS_S3_BUCKET,
            Key: fileKey,
            UploadId,
            MultipartUpload: {
                Parts: uploadParts,
            },
        }).send((err, data) => {
            console.log(err, "error:-");
        });
        const url = `https://${AWS_S3_BUCKET}.s3.amazonaws.com/${fileKey}`;
        return { url, key: fileKey };
    } catch (error) {
        console.error("Upload failed:", error);
        throw error;
    }
};
