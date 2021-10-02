import * as AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export async function createTodo(newTodo: object) {
    await docClient.put({
        TableName: todosTable,
        Item: newTodo
    }).promise()
}
