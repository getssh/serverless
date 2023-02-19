import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { TodoUpdate } from '../models/TodoUpdate';
// import * as createError from 'http-errors'

// TODO: Implement businessLogic
const todosAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()
const logger = createLogger('todos')

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
    return todosAccess.getAllTodos(userId)
}

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    return todosAccess.getAllTodos(userId)
}

export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    userId: string
): Promise<TodoItem> {
    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
    const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
    const newTodo: TodoItem = {
        userId,
        todoId,
        createdAt,
        done: false,
        attachmentUrl: s3AttachmentUrl,
        ...createTodoRequest
    }

    return await todosAccess.createTodoItem(newTodo)
}

export async function updateTodo(
    todoId: string,
    updateTodoRequest: UpdateTodoRequest,
    userId: string
): Promise<TodoUpdate> {
    return todosAccess.updateTodoItem(todoId, userId, updateTodoRequest)
}

export async function deleteTodo(
    todoId: string,
    userId: string
): Promise<void> {
    return todosAccess.deleteTodoItem(todoId, userId)
}

export async function generateUploadUrl(
    todoId: string,
    userId: string
): Promise<string> {
    const attachmentUrl = await attachmentUtils.getAttachmentUrl(todoId)
    await todosAccess.updateTodoAttachment(todoId, userId, attachmentUrl)

    return attachmentUtils.getUploadUrl(todoId)
}

export async function getTodo(
    todoId: string,
    userId: string
): Promise<TodoItem> {
    return todosAccess.getTodoItem(todoId, userId)
}

export async function createAttachmentPresignedUrl(
    todoId: string,
    userId: string
): Promise<string> {
    const attachmentUrl = await attachmentUtils.getAttachmentUrl(todoId)
    await todosAccess.updateTodoAttachment(todoId, userId, attachmentUrl)
    logger.info('Attachment URL generated', attachmentUrl)
    return attachmentUtils.getUploadUrl(todoId)
}