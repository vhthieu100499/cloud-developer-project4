import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../dataLayer/attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'
// TODO: Implement businessLogic

const todosAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()
const logger = createLogger('Todos')

export async function getTodosForUser(userId: String): Promise<TodoItem[]> {
  logger.info('Get Todo by userId')
  return await todosAccess.getAllTodosBy(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  logger.info('Create Todo')
  const todoId = uuid.v4()

  return await todosAccess.createTodo({
    todoId: todoId,
    userId: userId,
    done: true,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    createdAt: new Date().toISOString()
  })
}

export async function updateTodo(
  updateTodoRequest: UpdateTodoRequest,
  todoId: string,
  userId: string
): Promise<string> {
  logger.info('Update Todo by todoId and userId')
  return await todosAccess.updateTodo(
    {
      name: updateTodoRequest.name,
      dueDate: updateTodoRequest.dueDate,
      done: updateTodoRequest.done
    },
    todoId,
    userId
  )
}

export async function deleteTodo(
  todoId: string,
  userId: string
): Promise<string> {
  logger.info('Delete Todo by todoId and userId')
  return await todosAccess.deleteTodoBy(todoId, userId)
}

export async function createAttachmentPresignedUrl(
  todoId: string
): Promise<string> {
  logger.info('Generate upload url for todoId')
  return await attachmentUtils.generateUploadUrl(todoId)
}

export async function updateAttachmentUrl(
  todoId: string,
  userId: string
): Promise<string> {
  logger.info('Update attachmentUrl to db by todoId and userId')
  return await todosAccess.updateAttachmentUrl(todoId, userId, `https://${process.env.ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${todoId}.png`)
}

export async function deleteAttachmentUrl(
  todoId: string
) {
  logger.info('Delete attachmentUrl by todoId')
  return await attachmentUtils.deleteAttachmentUrl(`https://${process.env.ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${todoId}.png`)
}
