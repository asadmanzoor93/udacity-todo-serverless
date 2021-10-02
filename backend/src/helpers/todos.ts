import * as AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE
const s3 = new AWS.S3({signatureVersion: 'v4'})

export async function putAttachment(userId, todoId, s3Bucket) {
    await docClient.update({
        TableName: todosTable,
        Key: {
            userId: userId,
            todoId: todoId
        },
        UpdateExpression: "set attachmentUrl = :attachmentUrl",
        ExpressionAttributeValues: {
            ":attachmentUrl": `https://${s3Bucket}.s3.amazonaws.com/${todoId}`
        }
    }).promise()
}

export function getSignedURL(bucket: string, expiry: string, todoId: string) {
    return s3.getSignedUrl('putObject', {
        Bucket: bucket,
        Key: todoId,
        Expires: parseInt(expiry)
    })
}
