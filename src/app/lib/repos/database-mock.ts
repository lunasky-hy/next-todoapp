
import { sampleCategories, sampleTodos } from "@/app/lib/models/sampledata";
import { TaskDatabase } from "@/app/lib/repos/database";
import { Todo } from "@/app/lib/models/todoItem";

type MockSourceModel = {
  todos: Array<Todo>;
  categories: Array<string>;
}

export default class MockDatabase implements TaskDatabase {
  mockData: MockSourceModel = {
    todos: [...sampleTodos], 
    categories: [...sampleCategories],
  };

  async getTasks(category?: string): Promise<Array<Todo>> {
    return category ? 
      this.mockData.todos.filter((todo) => todo.category === category) :
      Promise.resolve(this.mockData.todos);
  }

  async getTaskById(id: string): Promise<Todo | null> {
    const data = this.mockData.todos.find((it) => it.id === id);
    if (data) {
      return data;
    } else {
      return null;
    }
  }

  async createTask(todo: Todo): Promise<string> {
    try {
      const newTodo: Todo = {...todo, id: Date.now().toString()}

      this.mockData.todos = [...this.mockData.todos, newTodo];
      return newTodo.id;
    } catch {
      return "";
    }
  }

  async updateTask(todo: Todo): Promise<boolean> {
    const idx = this.mockData.todos.findIndex((item) => item.id === todo.id);
    if (idx >= 0) {
      this.mockData.todos[idx] = todo;
      return true;
    } else {
      return false;
    }
  }

  async deleteTask(id: string): Promise<void> {
    this.mockData.todos = this.mockData.todos.filter((todo) => todo.id !== id);
  }

  async getCategories(): Promise<Array<string>> {
    const categories = this.mockData.categories;

    return Promise.resolve(categories);
  }

  async createCategory(newCategory: string): Promise<Array<string>> {
    this.mockData.categories = [...this.mockData.categories, newCategory];
    return Promise.resolve(await this.getCategories());
  }

  async deleteCategory(category: string): Promise<void> {
    const tasks = await this.getTasks(category);
    if (tasks.length > 0) throw Error("Cannot delete category with tasks");

    this.mockData.categories = this.mockData.categories.filter((cat) => cat !== category);

    return Promise.resolve();
  }
}