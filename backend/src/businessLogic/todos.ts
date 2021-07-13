import 'source-map-support/register'
import * as AWS from "aws-sdk";
import * as uuid from 'uuid';
import { createLogger } from '../utils/logger'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { TodoItem } from '../models/TodoItem'

const docClient = new AWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE;
const bucketName = process.env.ATTACHMENTS_S3_BUCKET

const logger = createLogger('todos')


export const createTodo =  async (createTodoRequest: CreateTodoRequest) => {


  const todoId = uuid.v4();
  const userId = createTodoRequest.userId;
  const name = createTodoRequest.name;
  const dueDate = createTodoRequest.dueDate;

  const newTodo: TodoItem = {
    userId,
    todoId,
    createdAt: new Date().toISOString(),
    name,
    dueDate,
    done: false,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
  }

  await docClient.put({
    TableName: todosTable,
    Item: newTodo
  }).promise();
  logger.info("Created todo: " , newTodo);
  return {
    statusCode: 201,
    headers: { 'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({item: newTodo})
  }

}
