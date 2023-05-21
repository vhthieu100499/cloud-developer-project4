import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
import { updateAttachmentUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id

    console.log('Processing event: ', event)
    const uploadUrl = await createAttachmentPresignedUrl(todoId)
    // I think that the below code should exist.
    const userId = getUserId(event)
    await updateAttachmentUrl(todoId, userId)
    
    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl: uploadUrl
      })
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
