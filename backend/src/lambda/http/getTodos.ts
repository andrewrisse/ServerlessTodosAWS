import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient();

const todosTable = process.env.TODOS_TABLE;
const index = process.env.INDEX;

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

  const scanParams = {
    TableName: todosTable,
    IndexName: index,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId
    },
    limit,
    ExclusiveStartKey: nextKey
  }

  logger.info("Query params: ", scanParams);

  const result = await docClient.query(scanParams).promise()

  const items = result.Items

  logger.info("Result: " + result)

  // Return result
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items,
      // Encode the JSON object so a client can return it in a URL as is
      nextKey: encodeNextKey(result.LastEvaluatedKey)
    })
  }

}


function parseNextKeyParameter (event)  {
  const nextKeyStr = getQueryParameter(event, "nextKey")
  if(!nextKeyStr) return undefined;
  const uriDecoded = decodeURIComponent(nextKeyStr)
  return JSON.parse(uriDecoded)
}

function parseLimitParameter (event){
  const limitStr = getQueryParameter(event, "limit");
  if(!limitStr) return undefined;
  const limit = parseInt(limitStr, 10);
  if(limit <= 0) throw new Error ("Limit should be positive");
  return limit
}

/**
 * Get a query parameter or return "undefined"
 *
 * @param {Object} event HTTP event passed to a Lambda function
 * @param {string} name a name of a query parameter to return
 *
 * @returns {string} a value of a query parameter value or "undefined" if a parameter is not defined
 */
function getQueryParameter(event, name) {
  const queryParams = event.queryStringParameters
  if (!queryParams) {
    return undefined
  }

  return queryParams[name]
}

/**
 * Encode last evaluated key using
 *
 * @param {Object} lastEvaluatedKey a JS object that represents last evaluated key
 *
 * @return {string} URI encoded last evaluated key
 */
function encodeNextKey(lastEvaluatedKey) {
  if (!lastEvaluatedKey) {
    return null
  }

  return encodeURIComponent(JSON.stringify(lastEvaluatedKey))
}
