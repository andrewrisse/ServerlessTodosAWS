import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { updateTodo } from '../../businessLogic/todos'

const logger = createLogger('updateTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Processing event: " , event);

  const todoId = event.pathParameters.todoId
  const userId = getUserId(event);
  const updatedTodoRequest: UpdateTodoRequest = {...JSON.parse(event.body), todoId, userId};

    return updateTodo(updatedTodoRequest);

}
