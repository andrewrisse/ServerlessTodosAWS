import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { deleteTodo } from '../../businessLogic/todos'
import { DeleteTodoRequest } from '../../requests/DeleteTodoRequest'

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

    const deleteTodoRequest: DeleteTodoRequest = { todoId: todoId, userId: userId }
    return deleteTodo(deleteTodoRequest);

}
