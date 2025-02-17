import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  private readonly s3Client: S3Client;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: 'us-east-1',
      endpoint: 'http://localhost:9000',
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.configService.get('MINIO_ACCESS_KEY'),
        secretAccessKey: this.configService.get('MINIO_SECRET_KEY'),
      },
    });

    this.bucketName = this.configService.get<string>(
      'MINIO_PUBLIC_BUCKET_NAME',
    );
  }

  async upload(fileName: string, file: Buffer) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.get('MINIO_PUBLIC_BUCKET_NAME'),
        Key: fileName,
        Body: file,
      }),
    );
  }

  async deleteFile(fileName: string) {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
      }),
    );
  }

  async list(fileName: string) {
    const object = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
    });
    const file = await this.s3Client.send(object);

    const stream = file.Body as Readable;

    return new StreamableFile(stream);
  }
}
