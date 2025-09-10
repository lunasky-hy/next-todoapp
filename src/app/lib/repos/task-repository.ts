'use server'

import { Todo } from "@/app/lib/models/todoItem";
import FirestoreTaskDatabase, { TaskDatabase } from "@/app/lib/repos/database";
import MockDatabase from "./database-mock";
import { auth } from "@/app/lib/auth";

// const taskDatabase = new FirestoreTaskDatabase();
const taskDatabase: TaskDatabase = new MockDatabase();
const demoDatabase: TaskDatabase = new MockDatabase();

async function getTasks(): Promise<Array<Todo>> {
  console.log('database access: getTasks()');
  const database = (await auth())?.user ? taskDatabase : demoDatabase;
  return database.getTasks();
}

async function getTaskById(id: string): Promise<Todo | null> {
  console.log('database access: getTaskById()');
  const database = (await auth())?.user ? taskDatabase : demoDatabase;
  return database.getTaskById(id);
}

async function createTask(todo: Todo): Promise<string> {
  console.log('database access: createTask()');
  const database = (await auth())?.user ? taskDatabase : demoDatabase;
  return database.createTask(todo);
}

async function updateTask(todo: Todo): Promise<boolean> {
  console.log('database access: updateTask');
  const database = (await auth())?.user ? taskDatabase : demoDatabase;
  return database.updateTask(todo);
}

async function deleteTask(id: string): Promise<void> {
  console.log('database access: deleteTask');
  const database = (await auth())?.user ? taskDatabase : demoDatabase;
  return database.deleteTask(id);
}

async function getCategories(): Promise<Array<string>> {
  console.log('database access: getCategories');
  const database = (await auth())?.user ? taskDatabase : demoDatabase;
  return database.getCategories();
}

export { getTasks, getTaskById, createTask, updateTask, deleteTask, getCategories };