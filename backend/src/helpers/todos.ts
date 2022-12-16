import { TodosAccess } from './todosAcess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { TodoUpdate } from '../models/TodoUpdate';
import { AttachmentUtils } from './attachmentUtils'

// TODO: Implement businessLogic

const todo_instance = new TodosAccess();

const logger = createLogger('TodoAccess')

const attachmentUtils = new AttachmentUtils();


// Getting all todos by user function
export async function getAllTodos(userId: string): Promise<TodoItem[]> {
    return await todo_instance.getAllTodos(userId);
}

export async function getSingleTodo(todoId: string, userId: string): Promise<TodoItem> {
    return await todo_instance.getSingleTodo(todoId, userId);
}

// Creating todos function

export async function createTodo(userId: string, CreateTodoRequest: CreateTodoRequest): Promise<TodoItem> {
    const dueDate = new Date().toISOString();
    const todoId = uuid.v4();
    const { name } = CreateTodoRequest;
    const newItem: TodoItem = {
        userId,
        todoId,
        createdAt: new Date().toISOString(),
        name,
        dueDate,
        done: false,
        attachmentUrl: null
    };
    logger.info('new todo created')
    return await todo_instance.createTodo(newItem);
}

// Deletetodo function

export async function deleteTodo(todo: TodoItem): Promise<void> {
    // const todo = await todo_instance.getSingleTodo(id);

    // logger.info(`todo info: ${todo}`)

    // if (!todo) throw new Error('Invalid Todo')
    // if (todo.userId !== user_id) throw new Error('Todo does not belong to this user')

    return await todo_instance.deleteTodo(todo);
}

// Generate Upload Url function

export async function getUploadUrl(todoId: string, user_id: string): Promise<string> {
    const todo = await todo_instance.getSingleTodo(todoId, user_id);

    if (!todo) throw new Error('Invalid Todo')
    if (todo.userId !== user_id) throw new Error('Todo not from user')

    const randomImageId = uuid.v4();
    return await attachmentUtils.generateUploadUrl(randomImageId, todoId, user_id);
}

// Updatetodo function

export async function updateTodo(todoId: string, user_id: string, updateTodoItem: TodoUpdate): Promise<void> {
    const todo = await todo_instance.getSingleTodo(todoId, user_id);

    if (!todo) throw new Error('Invalid Todo')
    if (todo.userId !== user_id) throw new Error('Todo does not belong to this user')
    return await todo_instance.updateTodo(todoId, user_id, updateTodoItem);
}