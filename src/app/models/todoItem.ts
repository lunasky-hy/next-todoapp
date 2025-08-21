
// ToDoアイテムの型定義
export type Todo = {
  id: string;
  text: string;
  note?: string;
  completed: boolean;
  category?: string;
  createdAt?: number;
  updatedAt?: number;
};