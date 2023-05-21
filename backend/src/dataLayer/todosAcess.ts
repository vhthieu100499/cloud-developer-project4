import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
  ) {}

  async getAllTodosBy(userId: String): Promise<TodoItem[]> {
    logger.info('Getting all todos by userId')

    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        IndexName: process.env.TODOS_CREATED_AT_INDEX,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async createTodo(todoItem: TodoItem): Promise<TodoItem> {
    logger.info('Create todo')

    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: todoItem
      })
      .promise()

    return todoItem as TodoItem
  }

  async updateTodo(
    todoUpdate: TodoUpdate,
    todoId: string,
    userId: string
  ): Promise<string> {
    logger.info('Update todo')

    const params = {
      TableName: this.todosTable,
      Key: {
        todoId: todoId,
        userId: userId
      },
      UpdateExpression: 'set #name=:name, dueDate = :dueDate, done = :done',
      ExpressionAttributeNames: {
        "#name": "name"
      },
      ExpressionAttributeValues: {
        ':name': todoUpdate.name,
        ':dueDate': todoUpdate.dueDate,
        ':done': todoUpdate.done
      }
    }

    const result = await this.docClient.update(params).promise()
    logger.info(result)
    return 'Update successfully'
  }

  async deleteTodoBy(todoId: string, userId: string): Promise<string> {
    logger.info('Delete todo')

    const params = {
      TableName: this.todosTable,
      Key: {
        todoId: todoId,
        userId: userId
      }
    }

    const result = await this.docClient.delete(params).promise()
    logger.info(result)
    return 'Delete successfully'
  }

  async updateAttachmentUrl(todoId: string, userId: string, attachmentUrl: string): Promise<string> {
    logger.info('Update attachmentUrl')

    const params = {
      TableName: this.todosTable,
      Key: {
        todoId: todoId,
        userId: userId
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      }
    }
    
    const result = await this.docClient.update(params).promise()
    logger.info(result)
    return 'Update attachmentUrl successfully'
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    logger.info('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
