import { Todo } from "@/app/lib/models/todoItem";

export default interface TaskDatabase {
  getTasks(category?: string): Promise<Array<Todo>>;
  getTaskById(id: string): Promise<Todo | null>;
  createTask(todo: Todo): Promise<string>;
  updateTask(todo: Todo): Promise<boolean>;
  deleteTask(id: string): Promise<void>;
  getCategories(): Promise<Array<string>>;
  createCategory(newCategory: string): Promise<Array<string>>;
  deleteCategory(category: string): Promise<void>;
}