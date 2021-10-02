import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import * as middy from 'middy'
import {cors, httpErrorHandler} from 'middy/middlewares'

import {deleteTodo} from '../../helpers/businessLogic/deleteTodo'
import {getUserId} from '../utils'

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const todoId = event.pathParameters.todoId
        const userId = getUserId(event)
        await deleteTodo(userId, todoId)

        return {
            statusCode: 204,
            body: 'Todo Item Deleted Successfully'
        }
    }
)

handler
    .use(httpErrorHandler())
    .use(
        cors({
            credentials: true
        })
    )
