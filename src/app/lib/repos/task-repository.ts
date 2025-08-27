'use server'

import { Todo } from "@/app/lib/models/todoItem";
import FirestoreTaskDatabase from "@/app/lib/repos/database";
import MockDatabase from "./database-mock";
import { auth } from "@/app/lib/auth";

const taskDatabase = new FirestoreTaskDatabase();
// const taskDatabase = new MockDatabase();
const demoDatabase = new MockDatabase();

async function getTasks(): Promise<Array<Todo>> {
  const database = (await auth())?.user ? taskDatabase : demoDatabase;
  return database.getTasks();
}

async function getTaskById(id: string): Promise<Todo | null> {
  const database = (await auth())?.user ? taskDatabase : demoDatabase;
  return database.getTaskById(id);
}

 async function createTask(todo: Todo): Promise<string> {
  const database = (await auth())?.user ? taskDatabase : demoDatabase;
  return database.createTask(todo);
}

 async function updateTask(todo: Todo): Promise<boolean> {
  const database = (await auth())?.user ? taskDatabase : demoDatabase;
  return database.updateTask(todo);
}

 async function deleteTask(id: string): Promise<void> {
  const database = (await auth())?.user ? taskDatabase : demoDatabase;
  return database.deleteTask(id);
}

export { getTasks, getTaskById, createTask, updateTask, deleteTask };