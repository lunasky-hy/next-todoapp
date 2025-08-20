'use server'

import { sampleTodos } from "@/app/models/sampledata";
import { TaskDatabase } from "@/app/repos/database";
import { Todo } from "@/app/models/todoItem";

class MockDatabase implements TaskDatabase {
  mockDatabase: Array<Todo> = [...sampleTodos];

  async createTask(todo: Todo): Promise<string> {
    try {
      const newTodo: Todo = {...todo, id: Date.now().toString()}
      this.mockDatabase = [...this.mockDatabase, todo];
      return newTodo.id;
    } catch {
      return "";
    }
  }
  
  async getTasks(): Promise<Array<Todo>> {
    return this.mockDatabase;
  }

  async updateTask(todo: Todo): Promise<boolean> {
    const idx = this.mockDatabase.findIndex((item) => item.id === todo.id);
    if (idx >= 0) {
      this.mockDatabase[idx] = todo;
      return true;
    } else {
      return false;
    }
  }

  async deleteTask(id: string): Promise<void> {
    this.mockDatabase = this.mockDatabase.filter((todo) => todo.id !== id);
  }
}

const taskDatabase = new MockDatabase();

export async function getTasks(): Promise<Array<Todo>> {
  return taskDatabase.getTasks();
}

export async function createTask(todo: Todo): Promise<string> {
  return taskDatabase.createTask(todo);
}

export async function updateTask(todo: Todo): Promise<boolean> {
  return taskDatabase.updateTask(todo);
}

export async function deleteTask(id: string): Promise<void> {
  return taskDatabase.deleteTask(id);
}