import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
var AWSXRay = require('aws-xray-sdk');

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly userIdIndex = process.env.USER_ID_INDEX) {
    }

    async getAllTodos(userId: string): Promise<TodoItem[]> {
        logger.info('Getting all todos')

        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        const items = result.Items
        return items as TodoItem[]
    }

    async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
        logger.info('Creating a todo item')

        const output = await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise()
        logger.info('Todo item created', output)

        return todoItem as TodoItem
    }

    async updateTodoItem(todoId: string, userId: string, todoUpdate: TodoUpdate): Promise<TodoItem> {
        logger.info('Updating a todo item')

        const result = await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId
            },
            UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeValues: {
                ':name': todoUpdate.name,
                ':dueDate': todoUpdate.dueDate,
                ':done': todoUpdate.done
            },
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ReturnValues: 'ALL_NEW'
        }).promise()
        logger.info('Todo item updated', result)
        return result.Attributes as TodoItem
    }

    async deleteTodoItem(todoId: string, userId: string): Promise<void> {
        logger.info('Deleting a todo item')

        await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId
            }
        }).promise()
        logger.info('Todo item deleted')
    }

    async updateTodoAttachment(todoId: string, userId: string, attachmentUrl: string): Promise<void> {
        logger.info('Updating a todo item attachment')

        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': attachmentUrl
            },
            ReturnValues: 'UPDATED_NEW'
        }).promise()
    }

    async getTodoItem(todoId: string, userId: string): Promise<TodoItem> {
        logger.info('Getting a todo item')

        const result = await this.docClient.get({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId
            }
        }).promise()

        return result.Item as TodoItem
    }
}

