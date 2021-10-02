import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import {cors, httpErrorHandler} from 'middy/middlewares'

import {getSignedURL, putAttachment} from '../../helpers/todos'
import {getUserId} from '../utils'

const signedUrlExpiry = process.env.SIGNED_URL_EXPIRATION
const s3Bucket = process.env.ATTACHMENT_S3_BUCKET

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const todoId = event.pathParameters.todoId
        const userId = getUserId(event)

        const uploadUrl = getSignedURL(s3Bucket, signedUrlExpiry, todoId)
        await putAttachment(userId, todoId, s3Bucket)

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                uploadUrl: uploadUrl
            })
        }
    })

handler
    .use(httpErrorHandler())
    .use(
        cors({
            credentials: true
        })
    )
