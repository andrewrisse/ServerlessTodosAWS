import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
const AWS = require('aws-sdk');


const docClient = new AWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE;
const logger = createLogger('updateTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Processing event: " , event);

  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  const userId = getUserId(event);

  try{

   await docClient.put({TableName: todosTable, Item: updatedTodo, Key: {todoId, userId}}).promise();
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin' : "*"
      },
      body: ""
    }
  }
  catch(error){
    logger.error("Error updating todo: " , error.message)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin' : "*"
      },
      body: JSON.stringify({
        error: "Error updating todo"
      })

    }
  }

}
