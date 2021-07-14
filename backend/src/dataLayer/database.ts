import * as AWS from "aws-sdk";
import * as AWSXRay from 'aws-xray-sdk'

export const createS3Client = () => {
  const XAWS = AWSXRay.captureAWS(AWS);
  const s3 = new XAWS.S3({
    signatureVersion: 'v4'
  })
  return s3;
}

export const createDynamoDbClient = () => ( new AWS.DynamoDB.DocumentClient())
