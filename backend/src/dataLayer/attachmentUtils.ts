import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('AttachmentUtils')
// TODO: Implement the fileStogare logic
export class AttachmentUtils {
    constructor(
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
    ) { }

    async generateUploadUrl(todoId: string): Promise<string> {
        logger.info('Generate Upload Url')

        return this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: `${todoId}.png`,
            Expires: Number(this.urlExpiration)
        }) as string
    }

    async deleteAttachmentUrl(todoIdKey: string) {
        logger.info('Delete attachment Url')

        return this.s3.deleteObject({
            Bucket: this.bucketName,
            Key: todoIdKey,
        })
    }
}