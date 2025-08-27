'use server'

import { Todo } from "@/app/lib/models/todoItem";
import FirestoreTaskDatabase from "@/app/lib/repos/database";
import MockDatabase from "./database-mock";

const taskDatabase = new FirestoreTaskDatabase();
// const taskDatabase = new MockDatabase();

async function getTasks(): Promise<Array<Todo>> {
  return taskDatabase.getTasks();
}

async function getTaskById(id: string): Promise<Todo | null> {
  return taskDatabase.getTaskById(id);
}

 async function createTask(todo: Todo): Promise<string> {
  return taskDatabase.createTask(todo);
}

 async function updateTask(todo: Todo): Promise<boolean> {
  return taskDatabase.updateTask(todo);
}

 async function deleteTask(id: string): Promise<void> {
  return taskDatabase.deleteTask(id);
}

export { getTasks, getTaskById, createTask, updateTask, deleteTask };