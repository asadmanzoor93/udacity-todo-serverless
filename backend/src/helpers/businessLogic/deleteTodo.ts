import * as AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export async function deleteTodo(userId: string, todoId: string) {
    await docClient.delete({
        TableName: todosTable,
        Key: {
            userId: userId,
            todoId: todoId
        }
    }).promise()
}
