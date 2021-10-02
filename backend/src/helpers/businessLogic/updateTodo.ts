import * as AWS from 'aws-sdk'
import {UpdateTodoRequest} from "../../requests/UpdateTodoRequest";

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export async function updateTodo(userId: string, todoId: string, updatedTodo: UpdateTodoRequest) {
    await docClient.update({
        TableName: todosTable,
        Key: {
            userId: userId,
            todoId: todoId
        },
        UpdateExpression: "set #name = :n, #dueDate = :due, #done = :don",
        ExpressionAttributeNames: {
            "#name": "name",
            "#dueDate": "dueDate",
            "#done": "done",
        },
        ExpressionAttributeValues: {
            ":n": updatedTodo.name,
            ":due": updatedTodo.dueDate,
            ":don": updatedTodo.done
        },
    }).promise()
}
