import { S3Client, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { nanoid } from 'nanoid'

const client = new S3Client({
    region: "ru-1",
    endpoint: "https://s3.ru-1.storage.selcloud.ru",
    apiVersion: "latest",
    credentials: {
        accessKeyId: "222e64f850694258bc3879a8a88b44ce",
        secretAccessKey: "15d0bced37f74a958aadf41ded58c6ad"
    },
    forcePathStyle: true,
});

export const saveFileFromUrl = async (url: string) => {
    const res = await fetch(url);

    const filename = decodeURIComponent(res.headers.get('x-amz-meta-qqfilename'));
    const file = await res.arrayBuffer();
    const contentType = res.headers.get('content-type');
    const fileKey = `${nanoid()}.${filename}`;

    const putObjectInput: PutObjectCommandInput = {
        Bucket: 'favro-backup-files',
        Key: fileKey,
        ACL: 'public-read',
        ContentType: contentType,
        // @ts-ignore
        Body: file,
    }

    const putObjectCommand = new PutObjectCommand(putObjectInput);

    await client.send(putObjectCommand);

    return `https://40fd0ba5-7730-42c1-8cdf-c77c8f34fd26.selstorage.ru/${encodeURIComponent(fileKey)}`;
}
