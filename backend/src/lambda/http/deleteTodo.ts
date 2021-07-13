import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const AWS = require('aws-sdk');


const docClient = new AWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE;
const logger = createLogger('deleteTodo')



export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Processing event: " , event);

  const todoId = event.pathParameters.todoId
  const userId = getUserId(event);

  if(!todoId) {
    logger.error('Failed to parse query params');
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin' : "*"
      },
      body: JSON.stringify({
        error: "Invalid parameters"
      })

    }
  }

  try
    {await docClient.delete({TableName: todosTable, Key: {todoId, userId}}).promise();
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin' : "*"
        },
        body: "Successfully deleted"
      }
    }
    catch(e){
      logger.error('Error deleting todo: ', e.message);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin' : "*"
        },
        body: JSON.stringify({
          error: "Error deleting todo"
        })

      }
    }
}
