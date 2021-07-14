import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { getTodos, parseLimitParameter, parseNextKeyParameter } from '../../businessLogic/todos'


const logger = createLogger('getTodos')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Processing event: " , event);

  let nextKey // Next key to continue scan operation if necessary
  let limit // Maximum number of elements to return
  const userId = getUserId(event);

  try{
    nextKey = parseNextKeyParameter(event);
    limit = parseLimitParameter(event);
  }
  catch(e){
    logger.error("Failed to parse query params: ", e.message);
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

  return getTodos(userId, nextKey, limit);

}





