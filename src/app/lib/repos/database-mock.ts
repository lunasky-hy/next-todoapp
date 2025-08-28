
import { sampleTodos } from "@/app/lib/models/sampledata";
import { TaskDatabase } from "@/app/lib/repos/database";
import { Todo } from "@/app/lib/models/todoItem";

export default class MockDatabase implements TaskDatabase {
  mockDatabase: Array<Todo> = [...sampleTodos];
  async getTasks(): Promise<Array<Todo>> {
    return this.mockDatabase;
  }

  async getTaskById(id: string): Promise<Todo | null> {
    const data = this.mockDatabase.find((it) => it.id === id);
    if (data) {
      return data;
    } else {
      return null;
    }
  }

  getTasksByCategory(category: string): Promise<Array<Todo>> {
    return Promise.resolve(this.mockDatabase.filter((todo) => todo.category === category));
  }

  getCategories(): Promise<Array<string>> {
    const categories = this.mockDatabase
      .map((todo) => todo.category)
      .filter((todo) => todo !== undefined)
      .filter((item, idx, self) => self.indexOf(item) === idx);

    return Promise.resolve(categories);
  }

  async createTask(todo: Todo): Promise<string> {
    try {
      const newTodo: Todo = {...todo, id: Date.now().toString()}
      this.mockDatabase = [...this.mockDatabase, todo];
      return newTodo.id;
    } catch {
      return "";
    }
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