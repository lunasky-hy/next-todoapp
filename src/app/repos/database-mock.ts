'use server'

import { sampleTodos } from "@/app/models/sampledata";

let mockDatabase: Array<Todo> = [...sampleTodos];

export async function createTask(todo: Todo): Promise<number> {
  try {
    const newTodo: Todo = {...todo, id: Date.now()}
    mockDatabase = [...mockDatabase, todo];
    return newTodo.id;
  } catch {
    return -1;
  }
}

export async function getTasks(): Promise<Array<Todo>> {
  return mockDatabase;
}

export async function updateTask(todo: Todo): Promise<boolean> {
  const idx = mockDatabase.findIndex((item) => item.id === todo.id);
  if (idx >= 0) {
    mockDatabase[idx] = todo;
    return true;
  } else {
    return false;
  }
}

export async function deleteTask(id: number) {
  mockDatabase = mockDatabase.filter((todo) => todo.id !== id);
}