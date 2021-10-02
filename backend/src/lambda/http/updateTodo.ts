import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import * as middy from 'middy'
import {cors, httpErrorHandler} from 'middy/middlewares'

import {updateTodo} from '../../helpers/businessLogic/updateTodo'
import {UpdateTodoRequest} from '../../requests/UpdateTodoRequest'
import {getUserId} from '../utils'

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const todoId = event.pathParameters.todoId
        const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
        const userId = getUserId(event)
        await updateTodo(userId, todoId, updatedTodo)

        return {
            statusCode: 204,
            body: `Todo item: "${todoId}" updated.`
        }
    })

handler
    .use(httpErrorHandler())
    .use(
        cors({
            credentials: true
        })
    )
