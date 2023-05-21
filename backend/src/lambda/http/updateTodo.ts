import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

    // ==> I want to Update a TODO item by todoId and userId because I think it will be more exactly.
    // If my thinking do not suite for Udacity, I will fix it after you reviewed. Thank you.
    console.log('Processing event: ', event)
    const userId = getUserId(event)
    const result = await updateTodo(updatedTodo, todoId, userId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: result
      })
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
